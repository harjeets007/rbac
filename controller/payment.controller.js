const stripe = require("../config/stripe");
const Application = require("../models/application.model");
const Project = require("../models/project.model");
const Transaction = require("../models/transaction.model");
const paginate = require("../services/paginationService");
require("dotenv").config();

module.exports = {
  createCheckoutSession: async (req, res) => {
    try {
      const { projectId } = req.params;
      const freelancerId = req.user._id;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const application = await Application.findOne({
        project: projectId,
        status: "accepted",
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "No accepted freelancer found for this project",
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: project.title,
              },
              unit_amount: project.budget * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {
          projectId: project._id.toString(),
        },
        success_url: process.env.PAYMENT_SUCCESS,
        cancel_url: process.env.PAYMENT_CANCEL,
      });

      const transaction = await Transaction.create({
        project: project._id,
        client: project.client,
        freelancer: application.freelancer,
        amount: project.budget,
        currency: "inr",
        stripeSessionId: session.id,
        status: "pending",
      });

      return res.status(201).json({
        success: true,
        url: session.url,
        transaction,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  stripeWebhook: async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const projectId = session.metadata.projectId;
      await Transaction.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: "success" },
      );

      await Project.findByIdAndUpdate(projectId, {
        paymentStatus: "paid",
        status: "in-progress",
      });

      console.log("Payment successful");
    }

    res.json({ received: true });
  },
  getTransactionHistory: async (req, res) => {
    try {
      const userId = req.user._id;
      const role = req.user.role;
      const filter =
        role === "Client" ? { client: userId } : { freelancer: userId };

      const result = await paginate(Transaction, filter, {
        page: req.query.page,
        limit: req.query.limit,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};

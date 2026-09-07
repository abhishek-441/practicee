import Stripe from "stripe";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) return res.status(409).json({ message: "Already enrolled in this course" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: course.title },
            unit_amount: Math.round(course.price * 100)
          },
          quantity: 1
        }
      ],
      metadata: { courseId: String(course._id), studentId: req.user.id },
      success_url: `${process.env.CLIENT_URL}/courses/${course.slug}?enrolled=true`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${course.slug}`
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: "Checkout session failed", error: err.message });
  }
};

// Mounted with express.raw() BEFORE the json body parser for this one route (see index.js)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { courseId, studentId } = session.metadata || {};

    if (!courseId || !studentId) {
      console.error("Webhook missing metadata, cannot create enrollment", session.id);
      return res.json({ received: true });
    }

    try {
      const already = await Enrollment.findOne({ student: studentId, course: courseId });
      if (!already) {
        await Enrollment.create({
          student: studentId,
          course: courseId,
          amountPaid: (session.amount_total || 0) / 100,
          stripePaymentIntentId: session.payment_intent
        });
        await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
      }
    } catch (err) {
      // Log but still 200 the webhook so Stripe doesn't retry forever on a data issue;
      // reconcile manually from the Stripe dashboard if this happens.
      console.error("Failed to create enrollment from webhook:", err.message);
    }
  }

  res.json({ received: true });
};

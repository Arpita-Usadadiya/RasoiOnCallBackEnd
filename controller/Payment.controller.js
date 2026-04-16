const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { amount, bookingId } = req.body; // ⭐ THIS IS IMPORTANT

    if (!bookingId) {
      return res.status(400).json({
        message: "bookingId is required",
      });
    }

    const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],

  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Chef Booking"
        },
        unit_amount: amount * 100
      },
      quantity: 1
    }
  ],

  mode: "payment",

  metadata: {
    bookingId: bookingId
  },

  // success_url: `${process.env.CLIENT_URL}/payment-success?bookingId=${bookingId}`,
  // cancel_url: `${process.env.CLIENT_URL}/payment-cancel`
  success_url: "https://rasoi-on-call-git-main-arpita-usadadiyas-projects.vercel.app/payment-success?bookingId={CHECKOUT_SESSION_ID}",
cancel_url: "https://rasoi-on-call-git-main-arpita-usadadiyas-projects.vercel.app/"
});

    res.json({
      url: session.url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createCheckoutSession };

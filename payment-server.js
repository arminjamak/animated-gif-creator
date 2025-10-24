import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const PORT = 3002;

// Initialize Stripe with your secret key
// Replace with your actual Stripe secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here', {
  apiVersion: '2024-11-20.acacia',
});

app.use(cors());
app.use(express.json());

// Pricing configuration
const PRICING = {
  10: { amount: 500, credits: 10 }, // $5.00
  20: { amount: 800, credits: 20 }, // $8.00
  30: { amount: 1100, credits: 30 }, // $11.00
};

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { credits } = req.body;
    
    if (!PRICING[credits]) {
      return res.status(400).json({ error: 'Invalid credit package' });
    }

    const { amount, credits: creditAmount } = PRICING[credits];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${creditAmount} Generation Credits`,
              description: `Purchase ${creditAmount} generation credits for Animated GIF Creator`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'http://localhost:3000'}?success=true&credits=${creditAmount}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}?canceled=true`,
      metadata: {
        credits: creditAmount.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const credits = parseInt(session.metadata.credits);
    
    console.log(`Payment successful! Credits purchased: ${credits}`);
    // Here you would typically save this to a database
    // For now, we'll rely on client-side storage
  }

  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`💳 Payment server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set STRIPE_SECRET_KEY environment variable`);
});

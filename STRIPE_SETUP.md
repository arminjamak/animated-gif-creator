# Stripe Payment Integration Setup

This guide will help you set up Stripe payments for the Animated GIF Creator.

## 📋 Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js installed
3. The project dependencies installed (`npm install`)

## 🔑 Step 1: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
3. Create a `.env` file in the project root:

```bash
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🚀 Step 2: Run the Payment Server Locally

```bash
npm run payment-server
```

The payment server will run on `http://localhost:3002`

## 🧪 Step 3: Test Payments Locally

1. Start the payment server: `npm run payment-server`
2. Start the frontend: `npm run dev`
3. Click "Upgrade" and select a package
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

## 🌐 Step 4: Deploy to Production

### Option A: Deploy Payment Server to Heroku/Railway

1. Create a new app on Heroku or Railway
2. Add environment variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
3. Deploy the `payment-server.js` file
4. Update your frontend `.env`:
   ```
   VITE_PAYMENT_API_URL=https://your-payment-server.herokuapp.com
   ```

### Option B: Use Netlify Functions

Create `netlify/functions/create-checkout.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // ... implement checkout logic
};
```

## 🔔 Step 5: Set Up Webhooks

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-api.com/api/webhook`
4. Select events: `checkout.session.completed`
5. Copy the webhook secret to your `.env`

## 💳 Pricing Configuration

Current pricing (edit in `payment-server.js`):
- 10 generations: $5.00
- 20 generations: $8.00
- 30 generations: $11.00

## 🔒 Security Notes

- Never commit `.env` files to Git
- Use test keys for development
- Switch to live keys only in production
- Keep webhook secrets secure

## 📊 How It Works

1. User clicks "Upgrade" → Opens modal
2. User selects a package → Creates Stripe Checkout session
3. User completes payment → Redirected back with success
4. Credits are added to localStorage
5. Credits counter updates automatically

## 🐛 Troubleshooting

**Payment server won't start:**
- Check if port 3002 is available
- Verify Stripe key is set in `.env`

**Checkout not opening:**
- Check browser console for errors
- Verify payment server is running
- Check CORS settings

**Credits not updating:**
- Check localStorage in browser DevTools
- Verify success URL parameters
- Check for JavaScript errors

## 📝 Test Cards

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0025 0000 3155

For more test cards: https://stripe.com/docs/testing

import { defineEventHandler, getHeader } from 'h3';
import Stripe from 'stripe';
import { User } from '~~/server/models/user.model';

const buffer = (req: any) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};

export default defineEventHandler(async (event) => {
  console.log('we are here');
  const runtimeConfig = useRuntimeConfig(event);
  const stripeWebhookKey = runtimeConfig.stripeWebhookKey;

  const stripe = new Stripe(stripeWebhookKey!, {
    apiVersion: '2022-11-15',
  });
  const sig = getHeader(event, 'stripe-signature');
  const buf = await buffer(event.req);

  if (!sig || !buf) {
    return { status: 400, body: 'Missing signature or body' };
  }

  let eventData;
  try {
    eventData = stripe.webhooks.constructEvent(buf, sig, stripeWebhookKey!);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return { status: 400, body: `Webhook Error: ${err.message}` };
  }

  if (eventData.type === 'checkout.session.completed') {
    const session = eventData.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const packageId = session.metadata?.packageId;

    if (!userId || !packageId) {
      return { status: 400, body: 'Missing user or package information in metadata' };
    }

    const res = await User.findByIdAndUpdate(session.metadata?.userId, {
      subscription: {
        plan: 'pro',
        lifetime: true,
        purchasedAt: new Date(),
        transaction_id: '',
        expiresAt: null, // null for lifetime
      },
    });

    console.log('RES', session.metadata?.userId, res);

    console.log('✅ Payment successful');
  }

  return { status: 200, body: {} };
});

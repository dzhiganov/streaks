import { getServerSession } from '#auth';
import { defineEventHandler, setResponseStatus } from 'h3';
import Stripe from 'stripe';
import { User } from '~~/server/models/user.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  apiVersion: '2020-08-27',
});

export const offers = new Map([['lifetime', { priceInCents: 1999, name: 'Lifetime' }]]);

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  const currentUser = await User.findById(session.user.userId);
  const body = await readBody(event);
  const { packageId } = body;

  if (!offers.has(packageId)) {
    setResponseStatus(event, 404);
    return { error: `Package with id "${packageId}" does not exist.` };
  }

  const product = offers.get(packageId);

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product?.name,
            },
            unit_amount: product?.priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_URL}/app`,
      cancel_url: `${process.env.WEB_URL}/error?message=payment_failed`,
      metadata: {
        userId: currentUser._id.toString(),
        packageId: packageId,
      },
    });

    return { url: stripeSession.url };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    setResponseStatus(event, 500);
    return { error: 'Failed to create checkout session', rawError: error };
  }
});

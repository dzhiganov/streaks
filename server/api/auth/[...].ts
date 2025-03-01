import GoogleProvider from 'next-auth/providers/google';
// import EmailProvider from "next-auth/providers/email"
import { NuxtAuthHandler } from '#auth';
import dayjs from 'dayjs';
import { User } from '~~/server/models/user.model';

const AUTH_ERRORS = {
  trialExpired: 'TRIAL_EXPIRED',
  loginFailed: 'LOGIN_FAILED',
};

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET || 'my-auth-secret',
  providers: [
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // EmailProvider.default({
    //     server: process.env.EMAIL_SERVER,
    //     from: process.env.EMAIL_FROM,
    //     // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    //   }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        const google_id = token.sub;
        const res = await User.findOne({ google_id });

        if (!res) return session;

        return {
          ...session,
          user: {
            name: session.user?.name,
            email: session.user?.email,
            image: session.user?.image,
            google_id: google_id,
            userId: res._id.toString(),
            subscription: res.subscription,
            trialExpired:
              res.subscription?.plan === 'trial' &&
              dayjs().isAfter(dayjs(res.subscription.trialExpiresAt)),
          },
        };
      } catch (err) {
        console.log('Session callback error: ', err);
        return session;
      }
    },
    async signIn({ user, profile }) {
      // Add user to the DB if not existed
      try {
        const currentUser = await User.findOne({ google_id: user.id });

        if (!currentUser && profile) {
          const newUser = {
            google_id: user.id,
            email: profile.email,
            name: profile.name,
            photo: profile.image,
            balance: 3,
            created_at: new Date(),
            subscription: {
              plan: 'trial',
              trialExpiresAt: dayjs().add(14, 'day').toDate(),
              lifetime: false,
              purchasedAt: null,
              expiresAt: null,
            },
          };

          await User.create(newUser);

          return true;
        }

        if (
          currentUser?.subscription?.plan === 'trial' &&
          dayjs().isAfter(dayjs(currentUser?.subscription.trialExpiresAt))
        ) {
          return `/error?message=trial_expired&error_code=${AUTH_ERRORS.trialExpired}`;
        }

        return true;
      } catch (err) {
        console.error('Error in signIn callback:', err);

        return `/error?message=login_failed&error_code=${AUTH_ERRORS.loginFailed}`;
      }
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/auth-error',
  },
});

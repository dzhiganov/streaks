import GoogleProvider from 'next-auth/providers/google';
// import EmailProvider from "next-auth/providers/email"
import { NuxtAuthHandler } from '#auth';
import { User } from '~~/server/models/user.model';

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
          },
        };
      } catch (err) {
        console.log('Session callback error: ', err);
        return session;
      }
    },
  },
  events: {
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
              plan: 'basic',
              lifetime: false,
              purchasedAt: null,
              expiresAt: null,
            },
          };

          await User.create(newUser);
        }
      } catch (err) {
        console.error('Error in signIn callback:', err);
      }
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});

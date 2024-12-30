import GoogleProvider  from 'next-auth/providers/google'
// import EmailProvider from "next-auth/providers/email"
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
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
        jwt: async ({ token, user }) => {
          const isSignIn = Boolean(user);

          if (isSignIn) {
            token.jwt = user.access_token ?? '';
            token.id = user.access_token ?? '';
            token.role = user.access_token ?? '';
          }
          return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {},
            }
        }
      },
    events: {
        async signIn({ profile }) {
            return true

        }
    },
    pages: {
        signIn: '/sign-in',
    }
})

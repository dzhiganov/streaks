import GoogleProvider  from 'next-auth/providers/google'
// import EmailProvider from "next-auth/providers/email"
import { NuxtAuthHandler } from '#auth'
import { User } from "~~/server/models/user.model";

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
            token.jwt = user ? user.access_token || '' : '';
            token.id = user ? user.id || '' : '';
            token.role = user ? user.role || '' : '';
          }
          return token
        },
        async session({ session, token }) {
            try {
                const googleId = token.id
                const res = await User.findOne({ googleId })

                if (!res) return session

                console.log('Session callback: ', res)
        
                return {
                    ...session,
                    user: {
                        name: session.user?.name,
                        email: session.user?.email,
                        image: session.user?.image,
                        googleId: googleId,
                        userId: res._id,
                    }
                }
            } catch(err) {
                console.log('Session callback error: ', err)
                return session
            }
        }
      },
    events: {
        async signIn({ user, profile }) {
            // Add user to the DB if not existed
            try {
                const currentUser = await User.findOne({ googleId: user.id })

                if (!currentUser && profile) {
                    const newUser = {
                        googleId: user.id,
                        email: profile.email,
                        name: profile.name,
                        photo: profile.image,
                        balance: 3,
                        createdAt: new Date(),
                      };
            
                      await User.create(newUser);
                }
            } catch(err) {
                console.error('Error in signIn callback:', err);
            }
            

        }
    },
    pages: {
        signIn: '/sign-in',
    }
})

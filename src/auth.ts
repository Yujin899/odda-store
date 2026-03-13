import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { authConfig } from './auth.config';
import clientPromise from './lib/mongodb-adapter';
import { connectDB } from './lib/mongodb';
import { User } from './models/User';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  events: {
    async createUser({ user }) {
      await connectDB();
      // Fetch the raw user created by the adapter and save via Mongoose to apply defaults/timestamps
      const dbUser = await User.findById(user.id);
      if (dbUser) {
        dbUser.role = 'customer';
        await dbUser.save();
      }
    }
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toString().toLowerCase() });
        if (!user || !user.password) return null;
        if (user.isBlocked) {
          throw new Error('Your account has been blocked by an administrator');
        }
        const valid = await (user as unknown as { comparePassword: (p: string) => Promise<boolean> }).comparePassword(credentials.password as string);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user && user.id) {
        await connectDB();
        const dbUser = await User.findById(user.id);
        if (dbUser?.isBlocked) {
          throw new Error('Your account has been blocked by an administrator');
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // 1. Initial sign-in: capture user data
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'customer';
      }

      // 2. Subsequent calls: fetch from DB if ID exists
      if (token.id) {
        await connectDB();
        const dbUser = await User.findById(token.id);
        
        if (dbUser?.isBlocked) {
          throw new Error('Account blocked');
        }

        if (dbUser) {
          token.role = dbUser.role || 'customer';
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'customer' | 'admin';
      }
      return session;
    },
  },
});

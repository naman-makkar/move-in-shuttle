import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { dbConnect } from './dbConnect';
import User from '@/models/user';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.userId || !credentials?.password) {
          return null;
        }
        
        await dbConnect();
        
        const user = await User.findOne({ userId: credentials.userId });
        
        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }
        
        return {
          id: user._id.toString(),
          userId: user.userId,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 
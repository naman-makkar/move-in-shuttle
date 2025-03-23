import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
	secret: process.env.NEXTAUTH_SECRET, // Add this line
	session: {
		strategy: 'jwt'
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				// 1) Connect to DB
				await dbConnect();

				// 2) Find user by email
				const user = await User.findOne({ email: credentials.email });
				if (!user) {
					throw new Error('Invalid email or password');
				}

				// 3) Compare passwords
				const isMatch = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isMatch) {
					throw new Error('Invalid email or password');
				}

				// 4) Return user data
				return {
					id: user.userId, // We'll store userId in the token
					email: user.email,
					role: user.role
				};
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			// When user logs in, attach role and userId to the token
			if (user) {
				token.userId = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			// Expose userId and role in the session
			session.user.userId = token.userId;
			session.user.role = token.role;
			return session;
		}
	},
	pages: {
		signIn: '/auth/login' // optional custom login page
	}
});

export { handler as GET, handler as POST };

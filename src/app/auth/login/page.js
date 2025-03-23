'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const res = await signIn('credentials', {
				redirect: false,
				email,
				password
			});

			if (res.error) {
				setError(res.error);
			} else {
				router.push('/dashboard');
			}
		} catch (error) {
			setError('An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='flex justify-center items-center min-h-screen bg-slate-50'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						Sign In
					</CardTitle>
					<CardDescription className='text-center'>
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				{error && (
					<div className='px-6 py-2'>
						<div className='bg-destructive/15 text-destructive text-sm p-3 rounded-md'>
							{error}
						</div>
					</div>
				)}
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='name@example.com'
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign In'}
						</Button>
					</form>
				</CardContent>
				<CardFooter className='flex justify-center'>
					<p className='text-sm text-muted-foreground'>
						Don&apos;t have an account?{' '}
						<Link
							href='/auth/register'
							className='text-primary hover:underline'>
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

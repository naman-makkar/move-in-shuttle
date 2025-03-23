// src/app/auth/register/page.js
'use client';

import { useState } from 'react';
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

export default function RegisterPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			if (password !== confirm) {
				setError('Passwords do not match');
				setIsLoading(false);
				return;
			}

			// Call the API register endpoint
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || 'Registration failed');
				return;
			}

			// Successful registration - redirect to login page
			router.push('/auth/login');
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
						Create Account
					</CardTitle>
					<CardDescription className='text-center'>
						Enter your details to create a new account
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
								placeholder='name@university.edu'
								required
							/>
							<p className='text-xs text-muted-foreground'>
								Must be a university email ending with @university.edu
							</p>
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
						<div className='space-y-2'>
							<Label htmlFor='confirm-password'>Confirm Password</Label>
							<Input
								id='confirm-password'
								type='password'
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								required
							/>
						</div>
						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}>
							{isLoading ? 'Creating account...' : 'Sign Up'}
						</Button>
					</form>
				</CardContent>
				<CardFooter className='flex justify-center'>
					<p className='text-sm text-muted-foreground'>
						Already have an account?{' '}
						<Link
							href='/auth/login'
							className='text-primary hover:underline'>
							Sign in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

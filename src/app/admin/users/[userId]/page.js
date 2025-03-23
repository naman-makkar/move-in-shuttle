// src/app/admin/users/[userId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
	UserIcon,
	WalletIcon,
	BadgeIcon,
	ArrowLeftIcon,
	SaveIcon,
	Loader2Icon
} from 'lucide-react';

export default function EditUserPage() {
	const router = useRouter();
	const path = usePathname();
	const userId = path.split('/').pop();

	const [email, setEmail] = useState('');
	const [walletBalance, setWalletBalance] = useState(0);
	const [role, setRole] = useState('student');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			setIsFetching(true);
			try {
				const res = await fetch(`/api/user/${userId}`);
				if (!res.ok) {
					setError('Failed to load user data');
					return;
				}
				const data = await res.json();
				if (data) {
					setEmail(data.email);
					setWalletBalance(data.walletBalance);
					setRole(data.role);
				}
			} catch (err) {
				setError('Error loading user data');
			} finally {
				setIsFetching(false);
			}
		}
		fetchUser();
	}, [userId]);

	async function handleUpdate(e) {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const res = await fetch(`/api/user/${userId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ walletBalance, role })
			});

			if (res.ok) {
				router.push('/admin/users');
			} else {
				const data = await res.json();
				setError(data.error || 'Update failed');
			}
		} catch (err) {
			setError('Error updating user');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<div className='flex items-center mb-6'>
				<Button
					variant='outline'
					size='sm'
					className='mr-4'
					onClick={() => router.push('/admin/users')}>
					<ArrowLeftIcon className='h-4 w-4 mr-2' />
					Back to Users
				</Button>
				<h1 className='text-3xl font-bold'>Edit User</h1>
			</div>

			{error && (
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{isFetching ? (
				<div className='flex justify-center items-center py-12'>
					<Loader2Icon className='h-6 w-6 text-slate-400 animate-spin' />
					<span className='ml-2 text-slate-600'>Loading user data...</span>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<Card className='border-slate-200 shadow-sm col-span-1'>
						<CardHeader>
							<CardTitle className='text-lg'>User Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='flex items-center gap-3'>
									<UserIcon className='h-5 w-5 text-slate-400' />
									<div>
										<div className='text-sm text-slate-500'>User ID</div>
										<div className='font-medium'>{userId}</div>
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<BadgeIcon className='h-5 w-5 text-slate-400' />
									<div>
										<div className='text-sm text-slate-500'>Role</div>
										<Badge
											className={
												role === 'admin'
													? 'bg-purple-100 text-purple-800'
													: 'bg-blue-100 text-blue-800'
											}>
											{role.toUpperCase()}
										</Badge>
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<WalletIcon className='h-5 w-5 text-slate-400' />
									<div>
										<div className='text-sm text-slate-500'>Wallet Balance</div>
										<div className='font-medium text-green-600'>
											{walletBalance}
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='border-slate-200 shadow-sm col-span-1 md:col-span-2'>
						<CardHeader>
							<CardTitle className='text-lg'>Edit User Details</CardTitle>
							<CardDescription>
								Update user role and wallet balance
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleUpdate}
								className='space-y-6'>
								<div className='space-y-4'>
									<div className='grid gap-2'>
										<Label
											htmlFor='email'
											className='text-slate-700'>
											Email
										</Label>
										<Input
											id='email'
											value={email}
											disabled
											className='bg-slate-50'
										/>
										<p className='text-xs text-slate-500 mt-1'>
											Email cannot be changed
										</p>
									</div>

									<div className='grid gap-2'>
										<Label
											htmlFor='role'
											className='text-slate-700'>
											Role
										</Label>
										<select
											id='role'
											value={role}
											onChange={(e) => setRole(e.target.value)}
											className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
											<option value='student'>Student</option>
											<option value='admin'>Administrator</option>
										</select>
									</div>

									<div className='grid gap-2'>
										<Label
											htmlFor='walletBalance'
											className='text-slate-700'>
											Wallet Balance
										</Label>
										<Input
											id='walletBalance'
											type='number'
											value={walletBalance}
											onChange={(e) => setWalletBalance(Number(e.target.value))}
											required
										/>
									</div>
								</div>

								<div className='flex justify-end gap-3 pt-4'>
									<Button
										type='button'
										variant='outline'
										onClick={() => router.push('/admin/users')}>
										Cancel
									</Button>
									<Button
										type='submit'
										className='bg-slate-800 hover:bg-slate-700'
										disabled={loading}>
										{loading ? (
											<>
												<Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
												Saving...
											</>
										) : (
											<>
												<SaveIcon className='mr-2 h-4 w-4' />
												Save Changes
											</>
										)}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}

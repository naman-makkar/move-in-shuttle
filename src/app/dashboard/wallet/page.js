// src/app/dashboard/wallet/page.js
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	WalletIcon,
	RefreshCwIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	UserIcon
} from 'lucide-react';

export default function WalletPage() {
	const { data: session, status } = useSession();
	const [walletBalance, setWalletBalance] = useState(null);
	const [transactions, setTransactions] = useState([]);
	const [rechargeAmount, setRechargeAmount] = useState(100);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [rechargeSuccess, setRechargeSuccess] = useState(false);

	// Fetch wallet balance and transactions when session is loaded
	useEffect(() => {
		if (status === 'authenticated' && session?.user?.userId) {
			fetchWalletInfo();
		}
	}, [status, session]);

	// Fetch wallet balance and transactions
	async function fetchWalletInfo() {
		if (status !== 'authenticated' || !session?.user?.userId) {
			setError('Please sign in to view your wallet');
			return;
		}

		setError('');
		setLoading(true);

		try {
			// 1) Fetch wallet balance
			let res = await fetch(`/api/user/wallet?userId=${session.user.userId}`);
			let data = await res.json();
			if (!res.ok) {
				setError(data.error || 'Failed to fetch wallet balance');
				setLoading(false);
				return;
			}
			setWalletBalance(data.walletBalance);

			// 2) Fetch transaction logs
			res = await fetch(
				`/api/user/wallet/transactions?userId=${session.user.userId}`
			);
			data = await res.json();
			if (!res.ok) {
				setError(data.error || 'Failed to fetch transactions');
				setLoading(false);
				return;
			}
			setTransactions(data);
		} catch (err) {
			console.error(err);
			setError('Error fetching wallet info');
		} finally {
			setLoading(false);
		}
	}

	// Handle recharge
	async function handleRecharge(e) {
		e.preventDefault();
		setError('');
		setRechargeSuccess(false);

		if (!session?.user?.userId) {
			setError('Please sign in to recharge your wallet');
			return;
		}

		if (rechargeAmount <= 0) {
			setError('Recharge amount must be greater than 0');
			return;
		}

		try {
			setLoading(true);
			const res = await fetch('/api/user/wallet/recharge', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: session.user.userId,
					amount: Number(rechargeAmount)
				})
			});

			const data = await res.json();

			if (res.ok) {
				setRechargeSuccess(true);
				// Refresh wallet info
				await fetchWalletInfo();
			} else {
				setError(data.error || 'Recharge failed');
			}
		} catch (err) {
			console.error(err);
			setError('Error recharging wallet');
		} finally {
			setLoading(false);
		}
	}

	function getTransactionTypeDetails(type) {
		switch (type.toLowerCase()) {
			case 'recharge':
			case 'credit':
			case 'refund':
			case 'bonus':
				return {
					icon: <ArrowUpIcon className='h-4 w-4 text-green-500' />,
					badgeClass: 'bg-green-100 text-green-800 hover:bg-green-100',
					isCredit: true
				};
			case 'booking':
			case 'payment':
			case 'debit':
			case 'fee':
				return {
					icon: <ArrowDownIcon className='h-4 w-4 text-red-500' />,
					badgeClass: 'bg-red-100 text-red-800 hover:bg-red-100',
					isCredit: false
				};
			default:
				return {
					icon: <RefreshCwIcon className='h-4 w-4 text-slate-500' />,
					badgeClass: 'bg-slate-100 text-slate-800 hover:bg-slate-100',
					isCredit: false
				};
		}
	}

	// Show loading state while session is loading
	if (status === 'loading') {
		return (
			<div className='container mx-auto px-4 py-8 max-w-4xl text-center'>
				<p>Loading wallet information...</p>
			</div>
		);
	}

	// Show error if not authenticated
	if (status === 'unauthenticated') {
		return (
			<div className='container mx-auto px-4 py-8 max-w-4xl'>
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertDescription>
						Please sign in to view your wallet
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<h1 className='text-3xl font-bold mb-6 text-center'>My Campus Wallet</h1>

			{error && (
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{rechargeSuccess && (
				<Alert className='mb-6 border-green-200 text-green-800 bg-green-50'>
					<AlertDescription>
						Your wallet has been successfully recharged! New balance:{' '}
						{walletBalance}
					</AlertDescription>
				</Alert>
			)}

			{/* User ID Display */}
			<Card className='border-slate-200 shadow-sm mb-6'>
				<CardHeader className='pb-2'>
					<CardTitle>User Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex items-center gap-3'>
						<UserIcon className='h-5 w-5 text-slate-700' />
						<div>
							<div className='font-medium'>
								{session.user.name || 'Student'}
							</div>
							<div className='text-sm text-slate-500'>
								ID: {session.user.userId}
							</div>
						</div>
						<Button
							variant='outline'
							size='sm'
							onClick={fetchWalletInfo}
							disabled={loading}
							className='ml-auto'>
							<RefreshCwIcon className='h-4 w-4 mr-1' />
							Refresh
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Wallet info */}
			{walletBalance !== null && (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
					<Card className='border-slate-200 shadow-sm col-span-1'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg'>Wallet Balance</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<div className='bg-green-50 p-3 rounded-full'>
										<WalletIcon className='h-6 w-6 text-green-600' />
									</div>
									<div className='text-3xl font-bold text-green-700'>
										{walletBalance}
									</div>
								</div>
								<div className='text-sm text-green-600 font-medium'>points</div>
							</div>
						</CardContent>
					</Card>

					<Card className='border-slate-200 shadow-sm col-span-1 md:col-span-2'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg'>Recharge Wallet</CardTitle>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleRecharge}
								className='space-y-4'>
								<div className='flex flex-col md:flex-row gap-4'>
									<div className='flex-grow space-y-2'>
										<Label
											htmlFor='rechargeAmount'
											className='text-green-700'>
											Amount
										</Label>
										<Input
											id='rechargeAmount'
											type='number'
											min='1'
											value={rechargeAmount}
											onChange={(e) => setRechargeAmount(e.target.value)}
											className='border-green-200 focus-visible:ring-green-500'
										/>
									</div>
									<div className='flex items-end'>
										<Button
											type='submit'
											className='bg-green-600 hover:bg-green-700 w-full md:w-auto'
											disabled={loading}>
											{loading ? 'Processing...' : 'Recharge'}
										</Button>
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Transaction logs */}
			{walletBalance !== null && (
				<Card className='border-slate-200 shadow-sm'>
					<CardHeader>
						<CardTitle>Transaction History</CardTitle>
						<CardDescription>
							Recent wallet transactions and activities
						</CardDescription>
					</CardHeader>
					<CardContent>
						{transactions.length === 0 ? (
							<div className='text-center py-8'>
								<p className='text-slate-500'>No transactions found</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date & Time</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead className='hidden md:table-cell'>
											Description
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{transactions.map((tx) => {
										const { icon, badgeClass, isCredit } =
											getTransactionTypeDetails(tx.type);
										return (
											<TableRow key={tx._id}>
												<TableCell className='font-medium'>
													{new Date(tx.createdAt).toLocaleString()}
												</TableCell>
												<TableCell>
													<Badge className={badgeClass}>
														<span className='flex items-center gap-1'>
															{/* {icon} */}
															{tx.type.toUpperCase()}
														</span>
													</Badge>
												</TableCell>
												<TableCell>
													<span
														className={
															isCredit
																? 'text-green-600 font-medium'
																: 'text-red-600'
														}>
														{isCredit ? '+' : ''}
														{tx.amount}
													</span>
												</TableCell>
												<TableCell className='hidden md:table-cell text-slate-500'>
													{tx.description || '-'}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

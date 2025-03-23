// src/app/admin/transactions/page.js
'use client';
import { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCwIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function fetchTransactions() {
		setLoading(true);
		try {
			const res = await fetch('/api/admin/transactions');
			if (res.ok) {
				const data = await res.json();
				setTransactions(data);
				setError('');
			} else {
				setError('Failed to load transactions');
			}
		} catch (err) {
			setError('Error fetching transactions');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchTransactions();
	}, []);

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

	return (
		<div className='container mx-auto px-4 py-8 max-w-6xl'>
			<h1 className='text-3xl font-bold mb-6'>Transaction Logs</h1>

			<div className='flex justify-between items-center mb-6'>
				<p className='text-slate-500'>Manage all system transactions</p>
				<Button
					variant='outline'
					size='sm'
					onClick={fetchTransactions}
					disabled={loading}
					className='text-slate-700'>
					<RefreshCwIcon className='h-4 w-4 mr-2' />
					{loading ? 'Refreshing...' : 'Refresh'}
				</Button>
			</div>

			{error && (
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<CardTitle>All Transactions</CardTitle>
					<CardDescription>
						Complete transaction history across all users
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
									<TableHead>User ID</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead className='hidden md:table-cell'>
										Description
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{transactions.map((tx) => {
									const { badgeClass, isCredit } = getTransactionTypeDetails(
										tx.type
									);
									return (
										<TableRow key={tx.transactionId}>
											<TableCell className='font-medium'>
												{new Date(tx.createdAt).toLocaleString()}
											</TableCell>
											<TableCell>{tx.userId}</TableCell>
											<TableCell>
												<Badge className={badgeClass}>
													<span className='flex items-center gap-1'>
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
		</div>
	);
}

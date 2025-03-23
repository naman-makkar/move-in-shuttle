// src/app/admin/users/page.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { UserIcon, WalletIcon, PencilIcon } from 'lucide-react';

export default async function AdminUsersPage() {
	await dbConnect();
	const users = await User.find({}).lean();

	return (
		<div className='container mx-auto px-4 py-8 max-w-6xl'>
			<h1 className='text-3xl font-bold mb-6'>User Management</h1>

			<div className='flex justify-between items-center mb-6'>
				<p className='text-slate-500'>Manage all system users</p>
			</div>

			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<CardTitle>All Users</CardTitle>
					<CardDescription>View and manage all user accounts</CardDescription>
				</CardHeader>
				<CardContent>
					{users.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-slate-500'>No users found</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User ID</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Wallet Balance</TableHead>
									<TableHead className='text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.userId}>
										<TableCell className='font-medium flex items-center gap-2'>
											<UserIcon className='h-4 w-4 text-slate-400' />
											{user.userId}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											<Badge
												className={
													user.role === 'admin'
														? 'bg-purple-100 text-purple-800'
														: 'bg-blue-100 text-blue-800'
												}>
												{user.role.toUpperCase()}
											</Badge>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-1'>
												<WalletIcon className='h-4 w-4 text-green-500' />
												<span className='text-green-600 font-medium'>
													{user.walletBalance}
												</span>
											</div>
										</TableCell>
										<TableCell className='text-right'>
											<Button
												variant='outline'
												size='sm'
												asChild>
												<Link href={`/admin/users/${user.userId}`}>
													<PencilIcon className='h-4 w-4 mr-1' />
													Edit
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

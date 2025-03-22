// src/app/admin/stops/page.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { PlusCircleIcon, EditIcon, MapPinIcon } from 'lucide-react';

export default function StopListPage() {
	const [stops, setStops] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStops() {
			try {
				setLoading(true);
				const res = await fetch('/api/admin/stops');
				if (res.ok) {
					const data = await res.json();
					setStops(data);
				} else {
					setError('Failed to load stops');
				}
			} catch (err) {
				console.error(err);
				setError('Error fetching stops');
			} finally {
				setLoading(false);
			}
		}
		fetchStops();
	}, []);

	return (
		<div className='container mx-auto px-4 py-8 max-w-6xl'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold'>Campus Shuttle Stops</h1>
				<Link href='/admin/stops/new'>
					<Button className='bg-slate-800 hover:bg-slate-700'>
						<PlusCircleIcon className='h-4 w-4 mr-2' />
						Create New Stop
					</Button>
				</Link>
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
					<CardTitle>All Stops</CardTitle>
					<CardDescription>
						Manage all campus shuttle stops from this dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='flex justify-center py-8'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800'></div>
						</div>
					) : stops.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-slate-500'>No stops found in the system</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Stop Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{stops.map((stop) => (
									<TableRow key={stop.stopId}>
										<TableCell className='font-medium'>
											<div className='flex items-center gap-2'>
												<MapPinIcon className='h-4 w-4 text-slate-500' />
												{stop.stopName}
											</div>
										</TableCell>
										<TableCell>
											{stop.isActive ? (
												<Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
													Active
												</Badge>
											) : (
												<Badge
													variant='outline'
													className='bg-slate-100 text-slate-800 hover:bg-slate-100'>
													Inactive
												</Badge>
											)}
										</TableCell>
										<TableCell className='text-right'>
											<Link href={`/admin/stops/${stop.stopId}`}>
												<Button
													variant='outline'
													size='sm'>
													<EditIcon className='h-4 w-4 mr-1' />
													Edit
												</Button>
											</Link>
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

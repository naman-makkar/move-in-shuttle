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
import {
	PlusCircleIcon,
	EditIcon,
	BusIcon,
	ClockIcon,
	MapPinIcon,
	CalendarIcon
} from 'lucide-react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';

export default function ShuttleListPage() {
	const [shuttles, setShuttles] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchShuttles() {
			try {
				setLoading(true);
				const res = await fetch('/api/admin/shuttles');
				if (res.ok) {
					const data = await res.json();
					setShuttles(data);
				} else {
					setError('Failed to load shuttles');
				}
			} catch (err) {
				console.error(err);
				setError('Error fetching shuttles');
			} finally {
				setLoading(false);
			}
		}
		fetchShuttles();
	}, []);

	const formatShiftLabel = (shift) => {
		switch (shift) {
			case 'morning':
				return 'Morning';
			case 'afternoon':
				return 'Afternoon';
			case 'evening':
				return 'Evening';
			case 'latenight':
				return 'Late Night';
			default:
				return shift;
		}
	};

	return (
		<div className='container mx-auto px-4 py-8 max-w-6xl'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold'>Campus Shuttles</h1>
				<Link href='/admin/shuttles/new'>
					<Button className='bg-slate-800 hover:bg-slate-700'>
						<PlusCircleIcon className='h-4 w-4 mr-2' />
						Create New Shuttle
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
					<CardTitle>All Shuttles</CardTitle>
					<CardDescription>
						Manage all campus shuttles from this dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='flex justify-center py-8'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800'></div>
						</div>
					) : shuttles.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-slate-500'>No shuttles found in the system</p>
						</div>
					) : (
						<div className='space-y-6'>
							{shuttles.map((shuttle) => (
								<Card
									key={shuttle.shuttleId}
									className='border border-slate-200'>
									<CardHeader className='pb-2'>
										<div className='flex justify-between'>
											<div className='flex items-center gap-2'>
												<BusIcon className='h-5 w-5 text-slate-500' />
												<CardTitle className='text-lg'>
													{shuttle.shuttleName}
												</CardTitle>
											</div>
											<Badge className='bg-slate-800'>
												{formatShiftLabel(shuttle.shift)}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className='pb-2'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
											<div className='flex items-center gap-2'>
												<CalendarIcon className='h-4 w-4 text-slate-500' />
												<div>
													<div className='text-sm text-slate-500'>
														Departure
													</div>
													<div>
														{new Date(shuttle.departureTime).toLocaleString()}
													</div>
												</div>
											</div>
											<div className='flex items-center gap-2'>
												<CalendarIcon className='h-4 w-4 text-slate-500' />
												<div>
													<div className='text-sm text-slate-500'>Arrival</div>
													<div>
														{new Date(shuttle.arrivalTime).toLocaleString()}
													</div>
												</div>
											</div>
											<div className='flex items-center gap-2'>
												<div>
													<div className='text-sm text-slate-500'>Capacity</div>
													<div>
														{shuttle.seats} seats ({shuttle.kmTravel} km route)
													</div>
												</div>
											</div>
										</div>

										<Accordion
											type='single'
											collapsible
											className='border rounded-md'>
											<AccordionItem value='stops'>
												<AccordionTrigger className='px-4'>
													<div className='flex items-center gap-2'>
														<MapPinIcon className='h-4 w-4' />
														<span>Route Stops ({shuttle.stops.length})</span>
													</div>
												</AccordionTrigger>
												<AccordionContent className='px-4'>
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>Stop ID</TableHead>
																<TableHead>Arrival Time</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{shuttle.stops.map((stop) => (
																<TableRow key={stop.stopId}>
																	<TableCell>{stop.stopId}</TableCell>
																	<TableCell>
																		{new Date(
																			stop.arrivalTime
																		).toLocaleTimeString()}
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</CardContent>
									<CardFooter className='pt-2'>
										<Link
											href={`/admin/shuttles/${shuttle.shuttleId}`}
											className='w-full'>
											<Button
												variant='outline'
												className='w-full'>
												<EditIcon className='h-4 w-4 mr-2' />
												Edit Shuttle
											</Button>
										</Link>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

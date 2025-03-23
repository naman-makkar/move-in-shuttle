// src/app/bookings/request/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { MapPinIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BookingRequestPage() {
	const router = useRouter();
	const [fromStop, setFromStop] = useState('');
	const [toStop, setToStop] = useState('');
	const [shift, setShift] = useState('morning');
	const [day, setDay] = useState('weekday');
	const [stops, setStops] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	// Fetch available stops from the stops API
	useEffect(() => {
		async function fetchStops() {
			try {
				setLoading(true);
				const res = await fetch('/api/admin/stops');
				if (res.ok) {
					const data = await res.json();
					setStops(data);
				} else {
					setError('Failed to fetch college shuttle stops');
				}
			} catch (err) {
				console.error(err);
				setError('Error fetching campus shuttle stops');
			} finally {
				setLoading(false);
			}
		}
		fetchStops();
	}, []);

	function handleSubmit(e) {
		e.preventDefault();
		if (!fromStop || !toStop || fromStop === toStop) {
			setError('Please select different pickup and drop-off locations');
			return;
		}
		// Redirect to shuttle search results with selected criteria as query parameters
		router.push(
			`/bookings/search/${encodeURIComponent(fromStop)}/${encodeURIComponent(toStop)}/${encodeURIComponent(shift)}/${encodeURIComponent(day)}`
		  );
		  
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<h1 className='text-3xl font-bold mb-6 text-center'>
				Book a Campus Shuttle
			</h1>

			{error && (
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<CardTitle>Find Your Shuttle</CardTitle>
					<CardDescription>
						Select your pickup and drop-off locations on campus
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							<div className='space-y-2'>
								<Label
									htmlFor='fromStop'
									className='flex items-center gap-2'>
									<MapPinIcon className='h-4 w-4' />
									Pickup Location
								</Label>
								<Select
									value={fromStop}
									onValueChange={setFromStop}
									disabled={loading}>
									<SelectTrigger id='fromStop'>
										<SelectValue placeholder='Select pickup location' />
									</SelectTrigger>
									<SelectContent>
										{stops.map((stop) => (
											<SelectItem
												key={stop.stopId}
												value={stop.stopId}>
												{stop.stopName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label
									htmlFor='toStop'
									className='flex items-center gap-2'>
									<ArrowRightIcon className='h-4 w-4' />
									Drop-off Location
								</Label>
								<Select
									value={toStop}
									onValueChange={setToStop}
									disabled={loading}>
									<SelectTrigger id='toStop'>
										<SelectValue placeholder='Select drop-off location' />
									</SelectTrigger>
									<SelectContent>
										{stops.map((stop) => (
											<SelectItem
												key={stop.stopId}
												value={stop.stopId}>
												{stop.stopName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							<div className='space-y-2'>
								<Label
									htmlFor='shift'
									className='flex items-center gap-2'>
									<ClockIcon className='h-4 w-4' />
									Time of Day
								</Label>
								<Select
									value={shift}
									onValueChange={setShift}>
									<SelectTrigger id='shift'>
										<SelectValue placeholder='Select time' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='morning'>
											Morning (6:30 AM - 12:00 PM)
										</SelectItem>
										<SelectItem value='afternoon'>
											Afternoon (12:00 PM - 5:00 PM)
										</SelectItem>
										<SelectItem value='evening'>
											Evening (5:00 PM - 11:30 PM)
										</SelectItem>
										<SelectItem value='latenight'>
											Late Night (11:30 PM - 2:00 AM)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label
									htmlFor='day'
									className='flex items-center gap-2'>
									<ClockIcon className='h-4 w-4' />
									Day Type
								</Label>
								<Select
									value={day}
									onValueChange={setDay}>
									<SelectTrigger id='day'>
										<SelectValue placeholder='Select day' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='weekday'>Class Day (Mon-Fri)</SelectItem>
										<SelectItem value='weekend'>Weekend (Sat-Sun)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						type='submit'
						className='w-full bg-slate-800 hover:bg-slate-700'
						onClick={handleSubmit}
						disabled={loading}>
						Find Shuttles
					</Button>
				</CardFooter>
			</Card>

			{/* <div className='mt-8'>
				<h2 className='text-xl font-semibold mb-4'>Popular Campus Routes</h2>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					<Card
						className='cursor-pointer hover:bg-slate-50'
						onClick={() => {
							setFromStop('dorms_main');
							setToStop('academic_center');
						}}>
						<CardHeader className='p-4'>
							<CardTitle className='text-md'>
								Dorms to Academic Center
							</CardTitle>
						</CardHeader>
					</Card>
					<Card
						className='cursor-pointer hover:bg-slate-50'
						onClick={() => {
							setFromStop('library');
							setToStop('student_union');
						}}>
						<CardHeader className='p-4'>
							<CardTitle className='text-md'>
								Library to Student Union
							</CardTitle>
						</CardHeader>
					</Card>
					<Card
						className='cursor-pointer hover:bg-slate-50'
						onClick={() => {
							setFromStop('offcampus_apts');
							setToStop('campus_main');
						}}>
						<CardHeader className='p-4'>
							<CardTitle className='text-md'>
								Off-Campus Apts to Main Campus
							</CardTitle>
						</CardHeader>
					</Card>
				</div>
			</div> */}
		</div>
	);
}

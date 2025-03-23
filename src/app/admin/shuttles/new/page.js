'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

export default function NewShuttlePage() {
	const router = useRouter();
	const [shuttleName, setShuttleName] = useState('');
	const [seats, setSeats] = useState('');
	const [departureTime, setDepartureTime] = useState('');
	const [arrivalTime, setArrivalTime] = useState('');
	const [kmTravel, setKmTravel] = useState('');
	const [shift, setShift] = useState('morning');
	const [selectedStops, setSelectedStops] = useState([]);
	const [availableStops, setAvailableStops] = useState([]);
	const [stopArrivalTimes, setStopArrivalTimes] = useState({});
	const [error, setError] = useState('');

	// Fetch available stops from stops API
	useEffect(() => {
		async function fetchStops() {
			try {
				const res = await fetch('/api/admin/stops');
				if (res.ok) {
					const data = await res.json();
					setAvailableStops(data);
				} else {
					setError('Failed to load stops');
				}
			} catch (err) {
				setError('Error fetching stops');
			}
		}
		fetchStops();
	}, []);

	function handleStopSelection(e) {
		const options = e.target.options;
		const selected = [];
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				selected.push(options[i].value);
			}
		}
		setSelectedStops(selected);
	}

	function handleStopArrivalTimeChange(stopId, value) {
		setStopArrivalTimes((prev) => ({ ...prev, [stopId]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');

		try {
			// Build stops array with each object: { stopId, arrivalTime }
			const stopsData = selectedStops.map((stopId) => ({
				stopId,
				arrivalTime: stopArrivalTimes[stopId]
					? new Date(stopArrivalTimes[stopId])
					: new Date()
			}));

			const res = await fetch('/api/admin/shuttles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					shuttleName,
					seats: Number(seats),
					departureTime,
					arrivalTime,
					stops: stopsData,
					kmTravel: Number(kmTravel),
					shift
				})
			});

			if (res.ok) {
				router.push('/admin/shuttles');
			} else {
				const data = await res.json();
				setError(data.error || 'Error creating shuttle');
			}
		} catch (err) {
			setError('An unexpected error occurred');
		}
	}

	return (
		<div className='container mx-auto py-10'>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>
						Create New Shuttle
					</CardTitle>
					<CardDescription>
						Set up a new shuttle with route and schedule
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-4'>
								<div className='grid gap-2'>
									<Label htmlFor='shuttleName'>Shuttle Name</Label>
									<Input
										id='shuttleName'
										type='text'
										value={shuttleName}
										onChange={(e) => setShuttleName(e.target.value)}
										placeholder='Enter shuttle name'
										required
									/>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='seats'>Seats</Label>
									<Input
										id='seats'
										type='number'
										value={seats}
										onChange={(e) => setSeats(e.target.value)}
										placeholder='Number of seats'
										required
									/>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='kmTravel'>Total KM Travel</Label>
									<Input
										id='kmTravel'
										type='number'
										value={kmTravel}
										onChange={(e) => setKmTravel(e.target.value)}
										placeholder='Distance in kilometers'
										required
									/>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='shift'>Shift</Label>
									<Select
										value={shift}
										onValueChange={setShift}>
										<SelectTrigger id='shift'>
											<SelectValue placeholder='Select shift' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='morning'>Morning</SelectItem>
											<SelectItem value='evening'>Evening</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='space-y-4'>
								<div className='grid gap-2'>
									<Label htmlFor='departureTime'>Departure Time</Label>
									<Input
										id='departureTime'
										type='datetime-local'
										value={departureTime}
										onChange={(e) => setDepartureTime(e.target.value)}
										required
									/>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='arrivalTime'>Arrival Time</Label>
									<Input
										id='arrivalTime'
										type='datetime-local'
										value={arrivalTime}
										onChange={(e) => setArrivalTime(e.target.value)}
										required
									/>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='stops'>Select Stops</Label>
									<select
										id='stops'
										multiple
										value={selectedStops}
										onChange={handleStopSelection}
										className='flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
										{availableStops.map((stop) => (
											<option
												key={stop.stopId}
												value={stop.stopId}>
												{stop.stopName}
											</option>
										))}
									</select>
									<p className='text-xs text-muted-foreground'>
										Hold Ctrl/Cmd to select multiple stops
									</p>
								</div>
							</div>
						</div>

						{selectedStops.length > 0 && (
							<div className='border rounded-md p-4 space-y-4'>
								<h3 className='font-medium'>
									Set Arrival Time for Each Selected Stop
								</h3>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									{selectedStops.map((stopId) => {
										const stop = availableStops.find(
											(s) => s.stopId === stopId
										);
										return (
											<div
												key={stopId}
												className='grid gap-2'>
												<Label htmlFor={`stop-${stopId}`}>
													{stop ? stop.stopName : stopId} Arrival Time
												</Label>
												<Input
													id={`stop-${stopId}`}
													type='datetime-local'
													value={stopArrivalTimes[stopId] || ''}
													onChange={(e) =>
														handleStopArrivalTimeChange(stopId, e.target.value)
													}
													required
												/>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{error && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
					</form>
				</CardContent>
				<CardFooter>
					<Button
						onClick={handleSubmit}
						className='w-full'
						disabled={
							!shuttleName ||
							!seats ||
							!departureTime ||
							!arrivalTime ||
							!kmTravel ||
							selectedStops.length === 0
						}>
						Create Shuttle
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

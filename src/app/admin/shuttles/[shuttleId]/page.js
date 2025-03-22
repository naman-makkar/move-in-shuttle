'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function EditShuttlePage() {
	const router = useRouter();
	const path = usePathname();
	const shuttleId = path.split('/').pop();

	const [shuttleName, setShuttleName] = useState('');
	const [seats, setSeats] = useState('');
	const [departureTime, setDepartureTime] = useState('');
	const [arrivalTime, setArrivalTime] = useState('');
	const [kmTravel, setKmTravel] = useState('');
	const [shift, setShift] = useState('morning');
	const [isActive, setIsActive] = useState(true);
	const [selectedStops, setSelectedStops] = useState([]);
	const [availableStops, setAvailableStops] = useState([]);
	const [stopArrivalTimes, setStopArrivalTimes] = useState({});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Fetch shuttle details
	useEffect(() => {
		async function fetchShuttle() {
			setIsLoading(true);
			try {
				const res = await fetch(`/api/admin/shuttles/${shuttleId}`);
				if (!res.ok) {
					setError('Failed to load shuttle');
					return;
				}
				const data = await res.json();
				setShuttleName(data.shuttleName);
				setSeats(data.seats);
				setDepartureTime(
					new Date(data.departureTime).toISOString().slice(0, 16)
				);
				setArrivalTime(new Date(data.arrivalTime).toISOString().slice(0, 16));
				setKmTravel(data.kmTravel);
				setShift(data.shift);
				setIsActive(data.isActive);
				setSelectedStops(data.stops.map((s) => s.stopId));
				const times = {};
				data.stops.forEach((s) => {
					times[s.stopId] = new Date(s.arrivalTime).toISOString().slice(0, 16);
				});
				setStopArrivalTimes(times);
			} catch (err) {
				setError('Error fetching shuttle');
			} finally {
				setIsLoading(false);
			}
		}
		fetchShuttle();
	}, [shuttleId]);

	// Fetch available stops
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

	async function handleUpdate(e) {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const stopsData = selectedStops.map((stopId) => ({
				stopId,
				arrivalTime: stopArrivalTimes[stopId]
					? new Date(stopArrivalTimes[stopId])
					: new Date()
			}));

			const res = await fetch(`/api/admin/shuttles/${shuttleId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					shuttleName,
					seats: Number(seats),
					departureTime,
					arrivalTime,
					stops: stopsData,
					kmTravel: Number(kmTravel),
					shift,
					isActive
				})
			});

			if (res.ok) {
				router.push('/admin/shuttles');
			} else {
				setError('Error updating shuttle');
			}
		} catch (err) {
			setError('Failed to update shuttle');
		} finally {
			setIsLoading(false);
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this shuttle?')) return;

		setIsLoading(true);
		try {
			const res = await fetch(`/api/admin/shuttles/${shuttleId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				router.push('/admin/shuttles');
			} else {
				setError('Error deleting shuttle');
			}
		} catch (err) {
			setError('Failed to delete shuttle');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='container mx-auto p-6 max-w-4xl'>
			<div className='bg-white rounded-lg shadow-md p-6'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-bold text-gray-800'>Edit Shuttle</h1>
					<button
						onClick={() => router.push('/admin/shuttles')}
						className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800'>
						Back to Shuttles
					</button>
				</div>

				{error && (
					<div className='mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700'>
						<p>{error}</p>
					</div>
				)}

				{isLoading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
					</div>
				) : (
					<form
						onSubmit={handleUpdate}
						className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Shuttle Name
								</label>
								<input
									type='text'
									value={shuttleName}
									onChange={(e) => setShuttleName(e.target.value)}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Seats
								</label>
								<input
									type='number'
									value={seats}
									onChange={(e) => setSeats(e.target.value)}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Departure Time
								</label>
								<input
									type='datetime-local'
									value={departureTime}
									onChange={(e) => setDepartureTime(e.target.value)}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Arrival Time
								</label>
								<input
									type='datetime-local'
									value={arrivalTime}
									onChange={(e) => setArrivalTime(e.target.value)}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Total KM Travel
								</label>
								<input
									type='number'
									value={kmTravel}
									onChange={(e) => setKmTravel(e.target.value)}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Shift
								</label>
								<select
									value={shift}
									onChange={(e) => setShift(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
									<option value='morning'>Morning</option>
									<option value='evening'>Evening</option>
								</select>
							</div>
						</div>

						<div className='flex items-center'>
							<label className='flex items-center cursor-pointer'>
								<input
									type='checkbox'
									checked={isActive}
									onChange={(e) => setIsActive(e.target.checked)}
									className='h-4 w-4 text-blue-600 rounded focus:ring-blue-500'
								/>
								<span className='ml-2 text-sm font-medium text-gray-700'>
									Active
								</span>
							</label>
						</div>

						<div className='border-t border-gray-200 pt-6'>
							<h2 className='text-lg font-medium text-gray-800 mb-4'>
								Manage Stops
							</h2>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Select Stops (hold Ctrl/Cmd to select multiple)
								</label>
								<select
									multiple
									value={selectedStops}
									onChange={handleStopSelection}
									className='w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
									{availableStops.map((stop) => (
										<option
											key={stop.stopId}
											value={stop.stopId}>
											{stop.stopName}
										</option>
									))}
								</select>
							</div>
						</div>

						{selectedStops.length > 0 && (
							<div className='border-t border-gray-200 pt-6'>
								<h3 className='text-lg font-medium text-gray-800 mb-4'>
									Set Arrival Time for Each Stop
								</h3>
								<div className='space-y-4'>
									{selectedStops.map((stopId) => {
										const stop = availableStops.find(
											(s) => s.stopId === stopId
										);
										return (
											<div
												key={stopId}
												className='flex flex-col md:flex-row md:items-center'>
												<label className='text-sm font-medium text-gray-700 md:w-1/3'>
													{stop ? stop.stopName : stopId}:
												</label>
												<input
													type='datetime-local'
													value={stopArrivalTimes[stopId] || ''}
													onChange={(e) =>
														handleStopArrivalTimeChange(stopId, e.target.value)
													}
													required
													className='w-full md:w-2/3 mt-1 md:mt-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
												/>
											</div>
										);
									})}
								</div>
							</div>
						)}

						<div className='flex items-center justify-between pt-6 border-t border-gray-200'>
							<button
								type='button'
								onClick={handleDelete}
								className='px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500'>
								Delete Shuttle
							</button>

							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
								disabled={isLoading}>
								{isLoading ? 'Updating...' : 'Update Shuttle'}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

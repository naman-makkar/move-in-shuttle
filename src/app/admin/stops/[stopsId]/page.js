// src/app/admin/stops/[stopId]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import { AlertCircle, MapPinIcon, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function EditStopPage() {
	const router = useRouter();
	const path = usePathname();
	const stopId = path.split('/').pop();

	const [stopName, setStopName] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [isActive, setIsActive] = useState(true);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		async function fetchStop() {
			try {
				setLoading(true);
				const res = await fetch(`/api/admin/stops/${stopId}`);
				if (!res.ok) {
					setError('Failed to load stop');
					return;
				}
				const data = await res.json();
				setStopName(data.stopName);
				setLatitude(data.location?.latitude || 0);
				setLongitude(data.location?.longitude || 0);
				setIsActive(data.isActive);
			} catch (err) {
				setError('Error fetching stop');
			} finally {
				setLoading(false);
			}
		}
		fetchStop();
	}, [stopId]);

	async function handleUpdate(e) {
		e.preventDefault();
		setError('');
		setSubmitting(true);

		try {
			const res = await fetch(`/api/admin/stops/${stopId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					stopName,
					latitude: Number(latitude),
					longitude: Number(longitude),
					isActive
				})
			});

			if (res.ok) {
				router.push('/admin/stops');
			} else {
				const data = await res.json();
				setError(data.error || 'Error updating stop');
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setSubmitting(false);
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this stop?')) return;

		setSubmitting(true);
		try {
			const res = await fetch(`/api/admin/stops/${stopId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				router.push('/admin/stops');
			} else {
				const data = await res.json();
				setError(data.error || 'Error deleting stop');
			}
		} catch (err) {
			setError('An unexpected error occurred during deletion');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className='container mx-auto py-10 max-w-md'>
			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<MapPinIcon className='h-5 w-5 text-slate-600' />
						<CardTitle className='text-2xl font-bold'>Edit Stop</CardTitle>
					</div>
					<CardDescription>
						Update or delete a shuttle stop location
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='flex justify-center py-8'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800'></div>
						</div>
					) : (
						<form className='space-y-4'>
							<div className='grid gap-2'>
								<Label htmlFor='stopName'>Stop Name</Label>
								<Input
									id='stopName'
									type='text'
									value={stopName}
									onChange={(e) => setStopName(e.target.value)}
									placeholder='Enter stop name'
									required
								/>
							</div>

							<div className='grid gap-2'>
								<Label htmlFor='latitude'>Latitude</Label>
								<Input
									id='latitude'
									type='number'
									step='any'
									value={latitude}
									onChange={(e) => setLatitude(e.target.value)}
									placeholder='e.g. 37.7749'
									required
								/>
							</div>

							<div className='grid gap-2'>
								<Label htmlFor='longitude'>Longitude</Label>
								<Input
									id='longitude'
									type='number'
									step='any'
									value={longitude}
									onChange={(e) => setLongitude(e.target.value)}
									placeholder='e.g. -122.4194'
									required
								/>
							</div>

							<div className='flex items-center space-x-2'>
								<Checkbox
									id='isActive'
									checked={isActive}
									onCheckedChange={setIsActive}
								/>
								<Label
									htmlFor='isActive'
									className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									Active
								</Label>
							</div>

							{error && (
								<Alert variant='destructive'>
									<AlertCircle className='h-4 w-4' />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
						</form>
					)}
				</CardContent>
				<CardFooter className='flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0'>
					<Button
						onClick={handleUpdate}
						className='w-full'
						disabled={
							loading || submitting || !stopName || !latitude || !longitude
						}>
						{submitting ? 'Updating...' : 'Update Stop'}
					</Button>
					<Button
						onClick={handleDelete}
						variant='destructive'
						className='w-full'
						disabled={loading || submitting}>
						<Trash2 className='h-4 w-4 mr-2' />
						Delete Stop
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

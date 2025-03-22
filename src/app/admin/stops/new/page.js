// src/app/admin/stops/new/page.js
'use client';
import { useState } from 'react';
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

export default function NewStopPage() {
	const router = useRouter();
	const [stopName, setStopName] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [error, setError] = useState('');

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');

		try {
			const res = await fetch('/api/admin/stops', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					stopName,
					latitude: Number(latitude),
					longitude: Number(longitude)
				})
			});

			if (res.ok) {
				router.push('/admin/stops');
			} else {
				const data = await res.json();
				setError(data.error || 'Error creating stop');
			}
		} catch (err) {
			setError('An unexpected error occurred');
		}
	}

	return (
		<div className='container mx-auto py-10 max-w-md'>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>Create New Stop</CardTitle>
					<CardDescription>Add a new shuttle stop location</CardDescription>
				</CardHeader>
				<CardContent>
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
						disabled={!stopName || !latitude || !longitude}>
						Create Stop
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

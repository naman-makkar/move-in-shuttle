// src/app/page.js
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	CarIcon,
	ClockIcon,
	MapPinIcon,
	CreditCardIcon,
	BookOpenIcon,
	CalendarIcon,
	ClipboardCheckIcon,
	GraduationCapIcon
} from 'lucide-react';

export default function HomePage() {
	return (
		<div className='flex flex-col min-h-screen'>
			{/* Hero Section */}
			<section className='w-full py-10 md:py-16 lg:py-20 bg-slate-100'>
				<div className='container px-4 md:px-6'>
					<div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
						<div className='flex flex-col justify-center space-y-4'>
							<div className='space-y-2'>
								<h1 className='text-3xl font-medium tracking-tight sm:text-4xl xl:text-5xl/none text-slate-900'>
									College Shuttle Service
								</h1>
								<p className='max-w-[600px] text-slate-700 md:text-lg'>
									Reliable campus transportation for college students. Get to
									classes, dorms, libraries, and events on time.
								</p>
							</div>
							<div className='flex flex-col gap-2 min-[400px]:flex-row'>
								<Button
									asChild
									size='lg'
									className='bg-slate-800 text-white hover:bg-slate-700'>
									<Link href='/bookings/request'>Book a Shuttle</Link>
								</Button>
								<Button
									asChild
									variant='outline'
									size='lg'
									className='border-slate-800 text-slate-800 hover:bg-slate-100'>
									<Link href='/dashboard'>View Schedule</Link>
								</Button>
							</div>
						</div>
						<div className='mx-auto flex w-full max-w-[420px] items-center justify-center lg:justify-end'>
							<div className='grid gap-6 lg:grid-cols-1'>
								<Card className='border border-slate-200 shadow-sm'>
									<CardHeader className='space-y-1'>
										<CardTitle className='text-xl text-slate-900'>
											Quick Campus Shuttle
										</CardTitle>
										<CardDescription className='text-slate-600'>
											Get around campus easily
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='rounded-md bg-slate-50 p-4 border border-slate-100'>
											<div className='flex items-center gap-2'>
												<MapPinIcon className='h-5 w-5 text-slate-700' />
												<div className='text-sm text-slate-700'>
													Dorms to academic buildings
												</div>
											</div>
											<div className='mt-2 flex items-center gap-2'>
												<ClockIcon className='h-5 w-5 text-slate-700' />
												<div className='text-sm text-slate-700'>
													Runs every 10 minutes during peak hours
												</div>
											</div>
											<div className='mt-2 flex items-center gap-2'>
												<CalendarIcon className='h-5 w-5 text-slate-700' />
												<div className='text-sm text-slate-700'>
													Available 7 days a week
												</div>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<Button
											className='w-full bg-slate-800 text-white hover:bg-slate-700'
											asChild>
											<Link href='/bookings/request'>Book Shuttle Now</Link>
										</Button>
									</CardFooter>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className='w-full py-10 md:py-16 lg:py-20 bg-white'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<Badge
								variant='outline'
								className='border-slate-800 text-slate-800'>
								Student Services
							</Badge>
							<h2 className='text-2xl font-medium tracking-tight sm:text-3xl text-slate-900'>
								College Shuttle Routes
							</h2>
							<p className='max-w-[800px] text-slate-600 md:text-lg/relaxed mx-auto'>
								Dedicated shuttle services designed specifically for college
								students.
							</p>
						</div>
					</div>
					<div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-10'>
						<Card className='border border-slate-200'>
							<CardHeader>
								<div className='p-2 bg-slate-100 rounded-lg w-fit'>
									<BookOpenIcon className='h-6 w-6 text-slate-700' />
								</div>
								<CardTitle className='mt-4 text-lg'>Campus Express</CardTitle>
								<CardDescription className='text-slate-600'>
									Quick routes between main campus locations.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className='space-y-2 text-sm text-slate-600'>
									<li>• Dorms to academic buildings</li>
									<li>• Library to lecture halls</li>
									<li>• Student center to dining halls</li>
								</ul>
							</CardContent>
						</Card>
						<Card className='border border-slate-200'>
							<CardHeader>
								<div className='p-2 bg-slate-100 rounded-lg w-fit'>
									<MapPinIcon className='h-6 w-6 text-slate-700' />
								</div>
								<CardTitle className='mt-4 text-lg'>
									Off-Campus Connect
								</CardTitle>
								<CardDescription className='text-slate-600'>
									Connecting off-campus housing to main campus.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className='space-y-2 text-sm text-slate-600'>
									<li>• Apartment complexes to campus</li>
									<li>• Shopping centers and groceries</li>
									<li>• Weekend extended service</li>
								</ul>
							</CardContent>
						</Card>
						<Card className='border border-slate-200'>
							<CardHeader>
								<div className='p-2 bg-slate-100 rounded-lg w-fit'>
									<ClipboardCheckIcon className='h-6 w-6 text-slate-700' />
								</div>
								<CardTitle className='mt-4 text-lg'>Special Services</CardTitle>
								<CardDescription className='text-slate-600'>
									Additional transportation options for students.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className='space-y-2 text-sm text-slate-600'>
									<li>• Late night safe rides</li>
									<li>• Game day shuttles</li>
									<li>• Airport shuttles during breaks</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Schedule Section */}
			<section className='w-full py-10 md:py-16 lg:py-20 bg-slate-50'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<h2 className='text-2xl font-medium tracking-tight sm:text-3xl text-slate-900'>
								Shuttle Schedule
							</h2>
							<p className='max-w-[600px] text-slate-600 md:text-lg/relaxed mx-auto'>
								View our current shuttle schedules and plan your campus commute.
							</p>
						</div>
					</div>
					<div className='mx-auto max-w-4xl mt-10'>
						<Tabs
							defaultValue='weekday'
							className='w-full'>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='weekday'>Class Days</TabsTrigger>
								<TabsTrigger value='weekend'>Weekends</TabsTrigger>
							</TabsList>
							<TabsContent
								value='weekday'
								className='mt-6'>
								<Card className='border border-slate-200'>
									<CardHeader>
										<CardTitle className='text-lg'>
											Monday - Friday Routes
										</CardTitle>
										<CardDescription>6:30 AM - 11:30 PM</CardDescription>
									</CardHeader>
									<CardContent className='p-0'>
										<div className='rounded-md border border-slate-100 bg-white p-6'>
											<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
												<div className='flex flex-col space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
													<div className='text-sm font-medium text-slate-700'>
														Main Campus Loop
													</div>
													<div className='text-base'>Every 10 min</div>
													<div className='text-xs text-slate-500'>
														Academic buildings to library
													</div>
												</div>
												<div className='flex flex-col space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
													<div className='text-sm font-medium text-slate-700'>
														Residence Express
													</div>
													<div className='text-base'>Every 15 min</div>
													<div className='text-xs text-slate-500'>
														Dorms to class buildings
													</div>
												</div>
												<div className='flex flex-col space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
													<div className='text-sm font-medium text-slate-700'>
														Off-Campus Route
													</div>
													<div className='text-base'>Every 30 min</div>
													<div className='text-xs text-slate-500'>
														Apartment complexes to campus
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent
								value='weekend'
								className='mt-6'>
								<Card className='border border-slate-200'>
									<CardHeader>
										<CardTitle className='text-lg'>
											Saturday - Sunday Routes
										</CardTitle>
										<CardDescription>8:00 AM - 10:00 PM</CardDescription>
									</CardHeader>
									<CardContent className='p-0'>
										<div className='rounded-md border border-slate-100 bg-white p-6'>
											<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
												<div className='flex flex-col space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
													<div className='text-sm font-medium text-slate-700'>
														Weekend Campus
													</div>
													<div className='text-base'>Every 30 min</div>
													<div className='text-xs text-slate-500'>
														Limited campus loop
													</div>
												</div>
												<div className='flex flex-col space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
													<div className='text-sm font-medium text-slate-700'>
														Shopping Shuttle
													</div>
													<div className='text-base'>Every 60 min</div>
													<div className='text-xs text-slate-500'>
														Campus to shopping centers
													</div>
												</div>
												<div className='flex flex-col space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
													<div className='text-sm font-medium text-slate-700'>
														Late Night Safe Ride
													</div>
													<div className='text-base'>8:00 PM - 2:00 AM</div>
													<div className='text-xs text-slate-500'>
														On-demand service
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='w-full py-10 md:py-16 lg:py-20 bg-white'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<h2 className='text-2xl font-medium tracking-tight sm:text-3xl text-slate-900'>
								Student-Friendly Features
							</h2>
							<p className='max-w-[600px] text-slate-600 md:text-lg/relaxed mx-auto'>
								Our shuttle service is designed with college students in mind.
							</p>
						</div>
					</div>
					<div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-10'>
						<div className='flex flex-col items-center space-y-2 text-center'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100'>
								<GraduationCapIcon className='h-6 w-6 text-slate-800' />
							</div>
							<h3 className='text-lg font-medium text-slate-900'>
								Student ID Integration
							</h3>
							<p className='text-sm text-slate-600'>
								Just tap your student ID to board - no cash needed.
							</p>
						</div>
						<div className='flex flex-col items-center space-y-2 text-center'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100'>
								<ClockIcon className='h-6 w-6 text-slate-800' />
							</div>
							<h3 className='text-lg font-medium text-slate-900'>
								Class Schedule Friendly
							</h3>
							<p className='text-sm text-slate-600'>
								Routes timed to match common class start and end times.
							</p>
						</div>
						<div className='flex flex-col items-center space-y-2 text-center'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100'>
								<MapPinIcon className='h-6 w-6 text-slate-800' />
							</div>
							<h3 className='text-lg font-medium text-slate-900'>
								Real-Time Tracking
							</h3>
							<p className='text-sm text-slate-600'>
								Track your shuttle in real-time on the mobile app.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='w-full py-10 md:py-16 lg:py-20 bg-slate-100'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center space-y-4 text-center'>
						<div className='space-y-2'>
							<h2 className='text-3xl font-medium tracking-tight sm:text-4xl text-slate-900'>
								Ready to Get Around Campus?
							</h2>
							<p className='max-w-[600px] text-slate-600 md:text-lg/relaxed mx-auto'>
								Download our app or book a shuttle online to start your journey.
							</p>
						</div>
						<div className='flex flex-col gap-2 min-[400px]:flex-row'>
							<Button
								asChild
								size='lg'
								className='bg-slate-800 text-white hover:bg-slate-700'>
								<Link href='/bookings/request'>Book a Shuttle</Link>
							</Button>
							<Button
								asChild
								variant='outline'
								size='lg'
								className='border-slate-800 text-slate-800 hover:bg-slate-100'>
								<Link href='/dashboard'>View Live Map</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='w-full py-6 bg-gray-100'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='flex items-center space-x-2'>
							<CarIcon className='h-6 w-6' />
							<span className='font-bold'>Shuttle Management System</span>
						</div>
						<div className='text-sm text-gray-500'>
							© 2025 Shuttle Management System. All rights reserved.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

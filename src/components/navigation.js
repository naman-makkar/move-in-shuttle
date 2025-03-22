'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
	CarIcon,
	BookIcon,
	MapIcon,
	TicketIcon,
	CalendarIcon,
	MenuIcon,
	BadgeInfoIcon,
	ClipboardListIcon,
	WalletIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
	// Temporary authentication placeholder (remove NextAuth dependency)
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const pathname = usePathname();
	const [walletBalance, setWalletBalance] = useState(0);

	// For demo purposes, you can toggle authentication state
	const login = () => {
		setIsAuthenticated(true);
		setUser({ name: 'Student', role: 'user' });
	};

	const logout = () => {
		setIsAuthenticated(false);
		setUser(null);
	};

	// Simulated role for testing
	const isAdmin = user?.role === 'admin';

	return (
		<header className='sticky top-0 z-50 w-full border-b border-slate-200 bg-white'>
			<div className='container flex h-16 items-center justify-between'>
				<Link
					href='/'
					className='flex items-center space-x-2 font-medium text-xl text-slate-800'>
					<CarIcon className='h-5 w-5 text-slate-800' />
					<span>University Shuttle</span>
				</Link>

				<div className='hidden md:flex'>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className='text-slate-700'>
									Shuttle Routes
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
										<li>
											<NavigationMenuLink asChild>
												<Link
													href='/admin/shuttles'
													className={cn(
														'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
														pathname === '/admin/shuttles' ? 'bg-slate-100' : ''
													)}>
													<div className='text-sm font-medium leading-none text-slate-900'>
														Campus Routes
													</div>
													<p className='line-clamp-2 text-sm leading-snug text-slate-500'>
														View all campus shuttle routes and schedules
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<Link
													href='/admin/stops'
													className={cn(
														'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
														pathname === '/admin/stops' ? 'bg-slate-100' : ''
													)}>
													<div className='text-sm font-medium leading-none text-slate-900'>
														Shuttle Stops
													</div>
													<p className='line-clamp-2 text-sm leading-snug text-slate-500'>
														Find all shuttle stop locations across campus
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
										{isAdmin && (
											<li>
												<NavigationMenuLink asChild>
													<Link
														href='/admin/users'
														className={cn(
															'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
															pathname === '/admin/users' ? 'bg-slate-100' : ''
														)}>
														<div className='text-sm font-medium leading-none text-slate-900'>
															Manage Users
														</div>
														<p className='line-clamp-2 text-sm leading-snug text-slate-500'>
															Administrate user accounts and balances
														</p>
													</Link>
												</NavigationMenuLink>
											</li>
										)}
										{isAdmin && (
											<li>
												<NavigationMenuLink asChild>
													<Link
														href='/admin/transactions'
														className={cn(
															'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
															pathname === '/admin/transactions'
																? 'bg-slate-100'
																: ''
														)}>
														<div className='text-sm font-medium leading-none text-slate-900'>
															Transactions
														</div>
														<p className='line-clamp-2 text-sm leading-snug text-slate-500'>
															View and manage payment transactions
														</p>
													</Link>
												</NavigationMenuLink>
											</li>
										)}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>

							<NavigationMenuItem>
								<NavigationMenuTrigger className='text-slate-700'>
									Ride Services
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2'>
										<li>
											<NavigationMenuLink asChild>
												<Link
													href='/bookings/request'
													className={cn(
														'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
														pathname === '/bookings/request'
															? 'bg-slate-100'
															: ''
													)}>
													<div className='text-sm font-medium leading-none text-slate-900'>
														Schedule a Ride
													</div>
													<p className='line-clamp-2 text-sm leading-snug text-slate-500'>
														Book a shuttle for campus transportation
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<Link
													href='/bookings/my'
													className={cn(
														'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
														pathname === '/bookings/my' ? 'bg-slate-100' : ''
													)}>
													<div className='text-sm font-medium leading-none text-slate-900'>
														My Rides
													</div>
													<p className='line-clamp-2 text-sm leading-snug text-slate-500'>
														View your scheduled and past rides
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<Link
													href='/bookings/cancel'
													className={cn(
														'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
														pathname === '/bookings/cancel'
															? 'bg-slate-100'
															: ''
													)}>
													<div className='text-sm font-medium leading-none text-slate-900'>
														Cancel Ride
													</div>
													<p className='line-clamp-2 text-sm leading-snug text-slate-500'>
														Cancel your scheduled shuttle service
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>

							<NavigationMenuItem>
								<Link
									href='/dashboard'
									legacyBehavior
									passHref>
									<NavigationMenuLink
										className={cn(
											navigationMenuTriggerStyle(),
											'text-slate-700'
										)}>
										Schedule
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>

							<NavigationMenuItem>
								<Link
									href='/dashboard/wallet'
									legacyBehavior
									passHref>
									<NavigationMenuLink
										className={cn(
											navigationMenuTriggerStyle(),
											'text-slate-700'
										)}>
										Student ID
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<div className='md:hidden'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='text-slate-700'>
								<MenuIcon className='h-5 w-5' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='w-[200px]'>
							<DropdownMenuLabel>Shuttle Routes</DropdownMenuLabel>
							<DropdownMenuItem asChild>
								<Link href='/admin/shuttles'>Campus Routes</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href='/admin/stops'>Shuttle Stops</Link>
							</DropdownMenuItem>
							{isAdmin && (
								<DropdownMenuItem asChild>
									<Link href='/admin/users'>Manage Users</Link>
								</DropdownMenuItem>
							)}
							{isAdmin && (
								<DropdownMenuItem asChild>
									<Link href='/admin/transactions'>Transactions</Link>
								</DropdownMenuItem>
							)}

							<DropdownMenuSeparator />
							<DropdownMenuLabel>Ride Services</DropdownMenuLabel>
							<DropdownMenuItem asChild>
								<Link href='/bookings/request'>Schedule a Ride</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href='/bookings/my'>My Rides</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href='/bookings/cancel'>Cancel Ride</Link>
							</DropdownMenuItem>

							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href='/dashboard'>Schedule</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href='/dashboard/wallet'>Student ID</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className='flex items-center gap-2'>
					{isAuthenticated ? (
						<div className='flex items-center gap-2'>
							<div className='flex flex-col items-end'>
								<span className='text-sm text-slate-700'>
									Hi, {user?.name || 'Student'}
								</span>
								{walletBalance !== null && (
									<span className='text-xs text-slate-500 flex items-center'>
										<WalletIcon className='h-3 w-3 mr-1' /> ₹{walletBalance}
									</span>
								)}
							</div>
							<Button
								variant='ghost'
								size='sm'
								className='text-slate-700'
								onClick={logout}>
								Logout
							</Button>
						</div>
					) : (
						<div className='flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								className='border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
								asChild>
								<Link href='/auth/login'>Sign In</Link>
							</Button>
							<Button
								size='sm'
								className='bg-slate-800 text-white hover:bg-slate-700'
								asChild>
								<Link href='/auth/register'>Register</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

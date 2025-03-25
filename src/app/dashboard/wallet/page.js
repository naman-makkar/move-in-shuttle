// src/app/dashboard/wallet/page.js
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
	WalletIcon,
	RefreshCwIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	UserIcon,
	CreditCardIcon,
	InfoIcon,
	CheckIcon,
	ShieldIcon,
	LockIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key');

// SVG Payment Method Icons
const PaymentIcons = {
	Visa: () => (
		<svg className="h-7" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="780" height="500" fill="white"/>
			<path d="M293.199 377.428L329.316 125.15H386.335L350.217 377.428H293.199Z" fill="#00579F"/>
			<path d="M534.552 130.543C522.218 125.401 502.962 120 479.277 120C421.795 120 381.187 149.311 381.187 191.957C381.187 224.892 410.177 242.775 432.419 254.077C455.073 265.637 462.977 273.023 462.977 283.069C462.977 298.634 442.791 305.762 423.912 305.762C397.742 305.762 383.755 300.877 363.833 290.574L356.443 285.944L348.542 335.587C363.321 343.484 391.055 350.359 419.815 350.359C481.327 350.359 521.168 321.561 521.168 276.16C521.168 251.52 504.356 232.121 469.256 215.527C447.93 204.712 435.085 197.582 435.085 186.048C435.085 175.49 448.057 164.675 477.046 164.675C500.218 164.675 516.764 170.073 529.097 175.234L534.04 177.803L542.196 130.543H534.552Z" fill="#00579F"/>
			<path d="M618.845 125.15C602.546 125.15 591.247 135.708 585.36 151.625L484.907 377.428H545.139C545.139 377.428 557.473 344.493 560.216 337.108C568.629 337.108 621.331 337.108 632.118 337.108C634.093 346.551 640.745 377.428 640.745 377.428H694.47L643.743 125.15H618.845ZM576.26 296.833C581.123 284.329 600.059 235.2 600.059 235.2C599.804 235.712 604.667 222.695 607.665 214.542L612.016 232.888C612.016 232.888 623.839 286.274 626.326 296.833H576.26Z" fill="#00579F"/>
			<path d="M234.155 125.15L177.649 292.205L171.762 263.151C160.974 229.961 133.082 193.95 101.594 176.001L153.09 377.428H213.578L300.077 125.15H234.155Z" fill="#00579F"/>
			<path d="M113.671 125.15H21.173L20 130.543C86.178 147.207 130.085 194.462 150.262 249.448L128.532 151.625C124.69 135.195 110.192 126.429 113.671 125.15Z" fill="#FAA61A"/>
		</svg>
	),
	Mastercard: () => (
		<svg className="h-7" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="780" height="500" fill="white"/>
			<path d="M449.539 250C449.539 319.599 393.022 376.116 323.423 376.116C253.824 376.116 197.307 319.599 197.307 250C197.307 180.401 253.824 123.884 323.423 123.884C393.022 123.884 449.539 180.401 449.539 250Z" fill="#D9222A"/>
			<path d="M582.693 250C582.693 319.599 526.176 376.116 456.577 376.116C386.978 376.116 330.461 319.599 330.461 250C330.461 180.401 386.978 123.884 456.577 123.884C526.176 123.884 582.693 180.401 582.693 250Z" fill="#0099DF"/>
			<path d="M390 174.207C407.989 195.072 419.032 222.475 419.032 252.429C419.032 282.382 407.989 309.785 390 330.651C372.011 309.785 360.968 282.382 360.968 252.429C360.968 222.475 372.011 195.072 390 174.207Z" fill="#EF5D20"/>
		</svg>
	),
	Amex: () => (
		<svg className="h-7" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="780" height="500" fill="#016FD0"/>
			<path d="M120 304.627H186.264L199.455 276.651H226.641V304.627H280.364V238.036H175.445L213.118 165.018H280.364V137.042H120V304.627Z" fill="white"/>
			<path d="M334.432 304.627H495.882V165.018H334.432V304.627ZM401.345 193.327H429.305V221.303H401.345V193.327ZM401.345 248.624H429.305V276.651H401.345V248.624ZM367.909 220.97H395.868V248.991H367.909V220.97ZM434.75 220.97H462.709V248.991H434.75V220.97Z" fill="white"/>
			<path d="M553.359 137.042L496.214 220.97V304.627H660V137.042H553.359Z" fill="white"/>
			<path d="M607.073 221.303H579.114V193.327H607.073V221.303ZM607.073 248.624V276.651H579.114V248.624H607.073ZM574.05 248.991H546.091V220.97H574.05V248.991ZM640.509 248.991H612.55V220.97H640.509V248.991Z" fill="#016FD0"/>
		</svg>
	),
	Discover: () => (
		<svg className="h-7" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="780" height="500" fill="white"/>
			<path d="M58.9656 189.5H721.034V310.5H58.9656V189.5Z" fill="#F48120"/>
			<path d="M435.584 250.5C435.584 294.196 400.196 329.584 356.5 329.584C312.804 329.584 277.416 294.196 277.416 250.5C277.416 206.804 312.804 171.416 356.5 171.416C400.196 171.416 435.584 206.804 435.584 250.5Z" fill="#F48120"/>
			<path d="M450 177.5H489.5V323.5H450V177.5Z" fill="#F48120"/>
			<path d="M513 177.5H552.5V323.5H513V177.5Z" fill="#F48120"/>
			<path d="M575 177.5H615V323.5H575V177.5Z" fill="#F48120"/>
			<path d="M638 177.5H677.5V323.5H638V177.5Z" fill="#F48120"/>
		</svg>
	),
	RuPay: () => (
		<svg className="h-7" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="780" height="500" fill="white"/>
			<path d="M143 167H520L450 250L520 333H143V167Z" fill="#097B3B"/>
			<path d="M520 167H637V333H520L450 250L520 167Z" fill="#F46F20"/>
			<path d="M143 250L213 167H143V250Z" fill="#0C76B9"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M227 225H252L264 245L275 225H300L280 257L300 289H275L264 269L252 289H227L247 257L227 225Z" fill="white"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M320 226H299V289H320C338 289 358 284 358 258C358 231 338 226 320 226ZM320 266H333C333 274 327 274 320 274V266ZM320 240H333C333 249 327 249 320 249V240Z" fill="white"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M375 225C355 225 337 238 337 257C337 276 355 289 375 289C395 289 412 276 412 257C412 238 395 225 375 225ZM375 268C368 268 362 263 362 257C362 250 368 246 375 246C381 246 387 250 387 257C387 263 381 268 375 268Z" fill="white"/>
			<path d="M429 229H404V246H429V229Z" fill="white"/>
			<path d="M429 272H404V289H429V272Z" fill="white"/>
			<path d="M404 254H442V264H404V254Z" fill="white"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M468 225C455 225 444 230 444 245H467V257H444C444 272 455 278 468 278C480 278 488 272 489 264H467V252H489C489 236 480 225 468 225Z" fill="white"/>
		</svg>
	),
	UPI: () => (
		<svg className="h-7" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="780" height="500" fill="white"/>
			<path d="M254.997 126L360.439 252.894V370.997H254.997V126Z" fill="#097B3B"/>
			<path d="M254.997 126L150 252.894V370.997H254.997V126Z" fill="#ED752E"/>
			<path d="M419.561 133.515H525.003V370.997H419.561V133.515Z" fill="#747474"/>
			<path d="M525.003 252.894L630 126V370.997H525.003V252.894Z" fill="#655BA7"/>
		</svg>
	),
	PayPal: () => (
		<svg className="h-7" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="780" height="500" fill="white"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M333.046 213.571C324.126 223.656 318.978 239.179 321.078 251.637C323.4 265.426 337.862 275.737 350.707 275.737C361.936 275.737 374.33 275.51 385.559 275.51C387.204 275.51 388.174 274.376 388.174 272.788L397.682 209.078C398.207 206.358 396.336 204.09 393.62 204.09H353.098C344.05 204.317 338.195 208.171 333.046 213.571Z" fill="#28346A"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M438.22 213.571C429.3 223.656 424.151 239.179 426.251 251.637C428.574 265.426 443.035 275.737 455.881 275.737C467.109 275.737 479.504 275.51 490.732 275.51C492.377 275.51 493.347 274.376 493.347 272.788L502.855 209.078C503.381 206.358 501.51 204.09 498.794 204.09H458.271C449.223 204.317 443.369 208.171 438.22 213.571Z" fill="#298FC2"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M333.046 213.571C336.666 208.171 344.05 204.317 353.098 204.317H388.699C389.819 204.317 390.376 205.678 390.15 206.585L380.866 269.841C380.641 270.975 379.671 271.882 378.526 271.882H350.933C332.851 271.882 320.553 257.037 323.4 239.179C324.828 229.77 327.9 220.361 333.046 213.571Z" fill="#28346A"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M438.22 213.571C441.839 208.171 449.223 204.317 458.271 204.317H493.872C494.992 204.317 495.549 205.678 495.323 206.585L486.039 269.841C485.814 270.975 484.844 271.882 483.699 271.882H456.106C438.024 271.882 425.726 257.037 428.574 239.179C430.001 229.77 433.071 220.361 438.22 213.571Z" fill="#298FC2"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M450.733 204.317L441.225 268.027C441.225 269.615 442.195 270.746 443.84 270.746H471.782C473.877 270.746 475.973 269.161 476.198 267.119L485.481 206.132C485.706 204.997 485.149 204.317 484.029 204.317H450.733Z" fill="#22284F"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M345.559 204.317L336.051 268.027C336.051 269.615 337.021 270.746 338.666 270.746H366.608C368.703 270.746 370.799 269.161 371.024 267.119L380.307 206.132C380.532 204.997 379.975 204.317 378.855 204.317H345.559Z" fill="#28346A"/>
		</svg>
	)
};

export default function WalletPage() {
	const { data: session, status } = useSession();
	const [walletBalance, setWalletBalance] = useState(null);
	const [transactions, setTransactions] = useState([]);
	const [rechargeAmount, setRechargeAmount] = useState(100);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [rechargeSuccess, setRechargeSuccess] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState('direct');
	const [selectedPresetAmount, setSelectedPresetAmount] = useState(null);

	// Preset recharge amounts
	const presetAmounts = [100, 200, 500, 1000];

	// Fetch wallet balance and transactions when session is loaded
	useEffect(() => {
		if (status === 'authenticated' && session?.user?.userId) {
			fetchWalletInfo();
		}
	}, [status, session]);

	// Fetch wallet balance and transactions
	async function fetchWalletInfo() {
		if (status !== 'authenticated' || !session?.user?.userId) {
			setError('Please sign in to view your wallet');
			return;
		}

		setError('');
		setLoading(true);

		try {
			// 1) Fetch wallet balance
			let res = await fetch(`/api/user/wallet?userId=${session.user.userId}`);
			let data = await res.json();
			if (!res.ok) {
				setError(data.error || 'Failed to fetch wallet balance');
				setLoading(false);
				return;
			}
			setWalletBalance(data.walletBalance);

			// 2) Fetch transaction logs
			res = await fetch(`/api/user/wallet/transactions/${encodeURIComponent(session.user.userId)}`);

			data = await res.json();
			if (!res.ok) {
				setError(data.error || 'Failed to fetch transactions');
				setLoading(false);
				return;
			}
			setTransactions(data);
		} catch (err) {
			console.error(err);
			setError('Error fetching wallet info');
		} finally {
			setLoading(false);
		}
	}

	// Handle direct recharge (existing method)
	async function handleDirectRecharge(e) {
		e.preventDefault();
		setError('');
		setRechargeSuccess(false);

		if (!session?.user?.userId) {
			setError('Please sign in to recharge your wallet');
			return;
		}

		if (rechargeAmount <= 0) {
			setError('Recharge amount must be greater than 0');
			return;
		}

		try {
			setLoading(true);
			const res = await fetch('/api/user/wallet/recharge', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: session.user.userId,
					amount: Number(rechargeAmount)
				})
			});

			const data = await res.json();

			if (res.ok) {
				setRechargeSuccess(true);
				// Refresh wallet info
				await fetchWalletInfo();
			} else {
				setError(data.error || 'Recharge failed');
			}
		} catch (err) {
			console.error(err);
			setError('Error recharging wallet');
		} finally {
			setLoading(false);
		}
	}

	// Handle Stripe payment
	async function handleStripePayment(e) {
		e.preventDefault();
		setError('');
		setRechargeSuccess(false);

		if (!session?.user?.userId) {
			setError('Please sign in to recharge your wallet');
			return;
		}

		if (rechargeAmount <= 0) {
			setError('Recharge amount must be greater than 0');
			return;
		}

		try {
			setLoading(true);
			
			// Create a checkout session
			const response = await fetch('/api/stripe/create-checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: Number(rechargeAmount),
				}),
			});

			const session = await response.json();
			
			if (response.ok) {
				// Redirect to Stripe Checkout
				window.location.href = session.url;
			} else {
				setError(session.error || 'Failed to create payment session');
			}
		} catch (err) {
			console.error('Payment error:', err);
			setError('Error processing payment');
		} finally {
			setLoading(false);
		}
	}

	// Handle recharge based on selected payment method
	function handleRecharge(e) {
		if (paymentMethod === 'direct') {
			handleDirectRecharge(e);
		} else if (paymentMethod === 'stripe') {
			handleStripePayment(e);
		}
	}

	// Handle preset amount selection
	function handlePresetAmountClick(amount) {
		setSelectedPresetAmount(amount);
		setRechargeAmount(amount);
	}

	function getTransactionTypeDetails(type) {
		switch (type.toLowerCase()) {
			case 'recharge':
			case 'credit':
			case 'refund':
			case 'bonus':
				return {
					icon: <ArrowUpIcon className='h-4 w-4 text-green-500' />,
					badgeClass: 'bg-green-100 text-green-800 hover:bg-green-100',
					isCredit: true
				};
			case 'booking':
			case 'payment':
			case 'debit':
			case 'fee':
				return {
					icon: <ArrowDownIcon className='h-4 w-4 text-red-500' />,
					badgeClass: 'bg-red-100 text-red-800 hover:bg-red-100',
					isCredit: false
				};
			default:
				return {
					icon: <RefreshCwIcon className='h-4 w-4 text-slate-500' />,
					badgeClass: 'bg-slate-100 text-slate-800 hover:bg-slate-100',
					isCredit: false
				};
		}
	}

	// Show loading state while session is loading
	if (status === 'loading') {
		return (
			<div className='container mx-auto px-4 py-8 max-w-4xl text-center'>
				<p>Loading wallet information...</p>
			</div>
		);
	}

	// Show error if not authenticated
	if (status === 'unauthenticated') {
		return (
			<div className='container mx-auto px-4 py-8 max-w-4xl'>
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertDescription>
						Please sign in to view your wallet
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<h1 className='text-3xl font-bold mb-6 text-center'>My Campus Wallet</h1>

			{error && (
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{rechargeSuccess && (
				<Alert className='mb-6 border-green-200 text-green-800 bg-green-50'>
					<AlertDescription>
						Your wallet has been successfully recharged! New balance:{' '}
						{walletBalance}
					</AlertDescription>
				</Alert>
			)}

			{/* User ID Display */}
			<Card className='border-slate-200 shadow-sm mb-6'>
				<CardHeader className='pb-2'>
					<CardTitle>User Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex items-center gap-3'>
						<UserIcon className='h-5 w-5 text-slate-700' />
						<div>
							<div className='font-medium'>
								{session.user.name || 'Student'}
							</div>
							<div className='text-sm text-slate-500'>
								ID: {session.user.userId}
							</div>
						</div>
						<Button
							variant='outline'
							size='sm'
							onClick={fetchWalletInfo}
							disabled={loading}
							className='ml-auto'>
							<RefreshCwIcon className='h-4 w-4 mr-1' />
							Refresh
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Wallet info */}
			{walletBalance !== null && (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
					<Card className='border-slate-200 shadow-sm col-span-1'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg'>Wallet Balance</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<div className='bg-green-50 p-3 rounded-full'>
										<WalletIcon className='h-6 w-6 text-green-600' />
									</div>
									<div className='text-3xl font-bold text-green-700'>
										{walletBalance}
									</div>
								</div>
								<div className='text-sm text-green-600 font-medium'>points</div>
							</div>
						</CardContent>
					</Card>

					<Card className='border-slate-200 shadow-sm col-span-1 md:col-span-2'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg'>Recharge Wallet</CardTitle>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="stripe">
								<TabsList className="grid w-full grid-cols-2 mb-4">
									<TabsTrigger value="stripe" onClick={() => setPaymentMethod('stripe')}>
										<CreditCardIcon className="h-4 w-4 mr-2" />
										Credit/Debit Card
									</TabsTrigger>
									<TabsTrigger value="direct" onClick={() => setPaymentMethod('direct')}>
										<WalletIcon className="h-4 w-4 mr-2" />
										Direct Credit
									</TabsTrigger>
								</TabsList>
								
								<TabsContent value="stripe" className="space-y-4">
									{/* Payment methods icons - Only Visa and Mastercard */}
									<div className="flex items-center justify-center gap-6 py-4 bg-slate-50 rounded-lg border border-slate-200">
										<div className="flex flex-col items-center gap-1">
											<PaymentIcons.Visa />
											<span className="text-xs text-slate-600 font-medium">Visa</span>
										</div>
										<div className="flex flex-col items-center gap-1">
											<PaymentIcons.Mastercard />
											<span className="text-xs text-slate-600 font-medium">Mastercard</span>
										</div>
									</div>
									
									<Separator className="my-3" />

									<div className="flex flex-wrap gap-2 mb-4">
										{presetAmounts.map(amount => (
											<Button
												key={amount}
												type="button"
												variant={selectedPresetAmount === amount ? "default" : "outline"}
												className={selectedPresetAmount === amount ? "bg-green-600 hover:bg-green-700" : ""}
												onClick={() => handlePresetAmountClick(amount)}
											>
												₹{amount}
											</Button>
										))}
									</div>
									
									<div className="space-y-2">
										<Label htmlFor="stripeAmount" className="text-green-700">Custom Amount</Label>
										<div className="flex items-center gap-2">
											<span className="text-slate-500">₹</span>
											<Input
												id="stripeAmount"
												type="number"
												min="10"
												value={rechargeAmount}
												onChange={(e) => {
													setRechargeAmount(e.target.value);
													setSelectedPresetAmount(null);
												}}
												className="border-green-200 focus-visible:ring-green-500"
											/>
										</div>
									</div>
									
									<div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex gap-2 items-start mt-2">
										<InfoIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
										<p className="text-xs text-blue-700">
											Your payment will be processed securely via Visa or Mastercard. After successful payment, 
											your wallet will be credited immediately.
										</p>
									</div>

									<div className="flex items-center justify-between text-xs text-slate-500 my-2">
										<div className="flex items-center">
											<LockIcon className="h-3.5 w-3.5 mr-1 text-slate-400" />
											<span>Secure Payment</span>
										</div>
										<div>Powered by Stripe</div>
									</div>
									
									<Button
										type="button"
										className="w-full mt-2 bg-green-600 hover:bg-green-700"
										onClick={handleStripePayment}
										disabled={loading}>
										{loading ? 'Processing...' : 'Pay with Card'}
									</Button>
								</TabsContent>
								
								<TabsContent value="direct" className="space-y-4">
									<form onSubmit={handleDirectRecharge} className="space-y-4">
										<div className="flex flex-col md:flex-row gap-4">
											<div className="flex-grow space-y-2">
												<Label htmlFor="rechargeAmount" className="text-green-700">Amount</Label>
												<Input
													id="rechargeAmount"
													type="number"
													min="1"
													value={rechargeAmount}
													onChange={(e) => setRechargeAmount(e.target.value)}
													className="border-green-200 focus-visible:ring-green-500"
												/>
											</div>
											<div className="flex items-end">
												<Button
													type="submit"
													className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
													disabled={loading}>
													{loading ? 'Processing...' : 'Recharge'}
												</Button>
											</div>
										</div>
									</form>
									<div className="bg-amber-50 p-3 rounded-md border border-amber-100 flex gap-2 items-start">
										<InfoIcon className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
										<p className="text-xs text-amber-700">
											Direct credit is for demonstration purposes only. In a real application,
											this would be connected to an actual payment gateway.
										</p>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Transaction logs */}
			{walletBalance !== null && (
				<Card className='border-slate-200 shadow-sm'>
					<CardHeader>
						<CardTitle>Transaction History</CardTitle>
						<CardDescription>
							Recent wallet transactions and activities
						</CardDescription>
					</CardHeader>
					<CardContent>
						{transactions.length === 0 ? (
							<div className='text-center py-8'>
								<p className='text-slate-500'>No transactions found</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date & Time</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead className='hidden md:table-cell'>
											Description
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{transactions.map((tx) => {
										const { icon, badgeClass, isCredit } =
											getTransactionTypeDetails(tx.type);
										return (
											<TableRow key={tx._id}>
												<TableCell className='font-medium'>
													{new Date(tx.createdAt).toLocaleString()}
												</TableCell>
												<TableCell>
													<Badge className={badgeClass}>
														<span className='flex items-center gap-1'>
															{/* {icon} */}
															{tx.type.toUpperCase()}
														</span>
													</Badge>
												</TableCell>
												<TableCell>
													<span
														className={
															isCredit
																? 'text-green-600 font-medium'
																: 'text-red-600'
														}>
														{isCredit ? '+' : ''}
														{tx.amount}
													</span>
												</TableCell>
												<TableCell className='hidden md:table-cell text-slate-500'>
													{tx.description || '-'}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

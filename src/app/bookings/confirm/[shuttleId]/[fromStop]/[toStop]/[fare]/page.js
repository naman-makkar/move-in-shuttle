'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
  TicketIcon,
  UserIcon,
  ArrowLeftIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BookingConfirmPage() {
  const router = useRouter();
  const { shuttleId, fromStop, toStop, fare } = useParams();
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [fromStopDetails, setFromStopDetails] = useState(null);
  const [toStopDetails, setToStopDetails] = useState(null);

  useEffect(() => {
    async function fetchStopDetails() {
      try {
        const res = await fetch('/api/admin/stops');
        if (res.ok) {
          const stopsData = await res.json();
          setFromStopDetails(stopsData.find((s) => s.stopId === fromStop));
          setToStopDetails(stopsData.find((s) => s.stopId === toStop));
        }
      } catch (err) {
        console.error('Error fetching stop details:', err);
      }
    }
    if (fromStop && toStop) {
      fetchStopDetails();
    }
  }, [fromStop, toStop]);

  async function handleConfirm() {
    if (status !== 'authenticated' || !session?.user?.userId) {
      setMessage('Please sign in to confirm your booking');
      return;
    }
    try {
      setIsLoading(true);
      setMessage('');
      const res = await fetch('/api/bookings/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.userId,
          shuttleId,
          fromStop,
          toStop,
          fare: Number(fare)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setBookingId(data.booking.bookingId);
      } else {
        setMessage(data.error || 'Failed to confirm booking');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while processing your booking');
    } finally {
      setIsLoading(false);
    }
  }

  const handleBackClick = () => {
    router.back();
  };

  function handleViewBookings() {
    const encodedUserId = encodeURIComponent(session?.user?.userId);
    router.push(`/bookings/my`);
  }
  

  if (status === 'loading') {
    return (
      <div className='container mx-auto px-4 py-8 max-w-4xl text-center'>
        <p>Loading booking information...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        {success ? 'Booking Confirmed' : 'Confirm Your Booking'}
      </h1>
      {message && (
        <Alert variant='destructive' className='mb-6'>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {success ? (
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader>
            <div className='flex items-center justify-center mb-4'>
              <div className='bg-green-100 text-green-800 p-3 rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                  <polyline points='22 4 12 14.01 9 11.01'></polyline>
                </svg>
              </div>
            </div>
            <CardTitle className='text-center'>Booking Successfully Confirmed</CardTitle>
            <CardDescription className='text-center'>
              Your booking has been confirmed. Please save your booking ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex justify-center mb-6'>
              <Badge className='text-lg py-1 px-4 bg-slate-800'>
                Booking ID: {bookingId}
              </Badge>
            </div>
            <div className='border border-slate-200 rounded-lg p-4 mb-6'>
              <div className='flex flex-col md:flex-row justify-between gap-4'>
                <div className='flex items-center gap-2'>
                  <MapPinIcon className='h-5 w-5 text-slate-500' />
                  <div>
                    <div className='text-sm text-slate-500'>From</div>
                    <div className='font-medium'>{fromStopDetails?.stopName || fromStop}</div>
                  </div>
                </div>
                <ArrowRightIcon className='h-5 w-5 text-slate-400 hidden md:block' />
                <div className='flex items-center gap-2'>
                  <MapPinIcon className='h-5 w-5 text-slate-500' />
                  <div>
                    <div className='text-sm text-slate-500'>To</div>
                    <div className='font-medium'>{toStopDetails?.stopName || toStop}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <TicketIcon className='h-5 w-5 text-slate-500' />
                  <div>
                    <div className='text-sm text-slate-500'>Fare</div>
                    <div className='font-medium'>₹{fare}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <Button className='w-full bg-slate-800 hover:bg-slate-700' onClick={handleViewBookings}>
              View My Bookings
            </Button>
            <Button variant='outline' className='w-full' onClick={() => router.push('/bookings/request')}>
              Book Another Shuttle
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader>
            <CardTitle>Review Your Booking</CardTitle>
            <CardDescription>Please confirm your shuttle booking details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='border border-slate-200 rounded-lg p-4'>
              <div className='flex flex-col md:flex-row justify-between gap-4 mb-4'>
                <div className='flex items-center gap-2'>
                  <MapPinIcon className='h-5 w-5 text-slate-500' />
                  <div>
                    <div className='text-sm text-slate-500'>From</div>
                    <div className='font-medium'>{fromStopDetails?.stopName || fromStop}</div>
                  </div>
                </div>
                <ArrowRightIcon className='h-5 w-5 text-slate-400 hidden md:block' />
                <div className='flex items-center gap-2'>
                  <MapPinIcon className='h-5 w-5 text-slate-500' />
                  <div>
                    <div className='text-sm text-slate-500'>To</div>
                    <div className='font-medium'>{toStopDetails?.stopName || toStop}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <TicketIcon className='h-5 w-5 text-slate-500' />
                  <div>
                    <div className='text-sm text-slate-500'>Fare</div>
                    <div className='font-medium'>₹{fare}</div>
                  </div>
                </div>
              </div>
              <div className='text-xs text-slate-500 border-t border-slate-200 pt-2'>
                Shuttle ID: {shuttleId}
              </div>
            </div>
            {status === 'authenticated' ? (
              <div className='border border-slate-200 rounded-lg p-4'>
                <div className='flex items-center gap-2'>
                  <UserIcon className='h-5 w-5 text-slate-500' />
                  <div>
                    <div className='text-sm text-slate-500'>User ID</div>
                    <div className='font-medium'>{session.user.userId}</div>
                    <div className='text-xs text-slate-500'>{session.user.name || 'Student'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <Alert className='bg-yellow-50 border-yellow-200'>
                <AlertDescription>Please sign in to continue with your booking.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <Button className='w-full bg-slate-800 hover:bg-slate-700' onClick={handleConfirm} disabled={isLoading || status !== 'authenticated'}>
              {isLoading ? 'Processing...' : 'Confirm Booking'}
            </Button>
            <Button variant='outline' className='w-full' onClick={handleBackClick} disabled={isLoading}>
              <ArrowLeftIcon className='h-4 w-4 mr-2' />
              Back to Shuttles
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

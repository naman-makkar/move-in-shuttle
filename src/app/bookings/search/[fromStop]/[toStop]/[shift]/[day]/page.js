'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  CalendarIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ShuttleSearchPage() {
  const router = useRouter();
  const { fromStop, toStop, shift, day } = useParams();
  const [shuttles, setShuttles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fromStopDetails, setFromStopDetails] = useState(null);
  const [toStopDetails, setToStopDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch stop details (assuming /api/admin/stops remains unchanged)
        const stopsRes = await fetch('/api/admin/stops');
        if (stopsRes.ok) {
          const stopsData = await stopsRes.json();
          setFromStopDetails(stopsData.find((s) => s.stopId === fromStop));
          setToStopDetails(stopsData.find((s) => s.stopId === toStop));
        }
        // Fetch shuttles from the new API endpoint
        const shuttlesRes = await fetch(
          `/api/bookings/search/${fromStop}/${toStop}/${shift}/${day}`
        );
        if (shuttlesRes.ok) {
          const data = await shuttlesRes.json();
          setShuttles(data);
        } else {
          setError('Failed to fetch available shuttles');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching shuttles');
      } finally {
        setLoading(false);
      }
    }

    if (fromStop && toStop && shift) {
      fetchData();
    } else {
      setError('Missing search parameters');
      setLoading(false);
    }
  }, [fromStop, toStop, shift, day]);

  const formatShiftTime = (shift) => {
    switch (shift) {
      case 'morning':
        return 'Morning (6:30 AM - 12:00 PM)';
      case 'afternoon':
        return 'Afternoon (12:00 PM - 5:00 PM)';
      case 'evening':
        return 'Evening (5:00 PM - 11:30 PM)';
      case 'latenight':
        return 'Late Night (11:30 PM - 2:00 AM)';
      default:
        return shift;
    }
  };

  const formatDayType = (day) =>
    day === 'weekday' ? 'Class Day (Mon-Fri)' : 'Weekend (Sat-Sun)';

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Available Shuttles</h1>
      {error && (
        <Alert variant='destructive' className='mb-6'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className='border-slate-200 shadow-sm mb-6'>
        <CardHeader>
          <CardTitle>Your Trip</CardTitle>
          <CardDescription>Shuttle search results based on your criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row justify-between mb-4 gap-4'>
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
              <ClockIcon className='h-5 w-5 text-slate-500' />
              <div>
                <div className='text-sm text-slate-500'>Time</div>
                <div className='font-medium'>{formatShiftTime(shift)}</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <CalendarIcon className='h-5 w-5 text-slate-500' />
              <div>
                <div className='text-sm text-slate-500'>Day</div>
                <div className='font-medium'>{formatDayType(day)}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant='outline' onClick={handleBackClick} className='w-full'>
            Change Search Criteria
          </Button>
        </CardFooter>
      </Card>

      {loading ? (
        <Card className='border-slate-200 shadow-sm p-8'>
          <div className='flex justify-center items-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800'></div>
          </div>
        </Card>
      ) : shuttles.length === 0 ? (
        <Card className='border-slate-200 shadow-sm'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <div className='text-xl font-semibold mb-2'>No Shuttles Available</div>
              <p className='text-slate-500'>
                There are no shuttles available for your selected route and time. Please try different locations or times.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackClick} className='w-full bg-slate-800 hover:bg-slate-700'>
              Back to Search
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className='grid grid-cols-1 gap-4'>
          {shuttles.map((shuttle) => (
            <Card key={shuttle.shuttleId} className='border-slate-200 shadow-sm'>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle>{shuttle.shuttleName}</CardTitle>
                  <Badge className='bg-slate-800'>₹{shuttle.fare} fare</Badge>
                </div>
                <CardDescription>
                  {fromStopDetails?.stopName || fromStop} to {toStopDetails?.stopName || toStop}
                </CardDescription>
              </CardHeader>
              <CardContent className='pb-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center gap-2'>
                    <ClockIcon className='h-4 w-4 text-slate-500' />
                    <div>
                      <div className='text-sm text-slate-500'>Departure</div>
                      <div>{new Date(shuttle.departureTime).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <ClockIcon className='h-4 w-4 text-slate-500' />
                    <div>
                      <div className='text-sm text-slate-500'>Arrival</div>
                      <div>{new Date(shuttle.arrivalTime).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className='mt-4 flex items-center gap-2'>
                  <div className='w-full bg-slate-100 rounded-full h-2'>
                    <div
                      className='bg-slate-800 h-2 rounded-full'
                      style={{ width: `${((shuttle.capacity - shuttle.seats) / shuttle.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <span className='text-sm text-slate-500 whitespace-nowrap'>
                    {shuttle.seats} seats left
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className='w-full bg-slate-800 hover:bg-slate-700'
                  onClick={() =>
                    router.push(
                      `/bookings/confirm/${shuttle.shuttleId}/${fromStop}/${toStop}/${shuttle.fare}`
                    )
                  }
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

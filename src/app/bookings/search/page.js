"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useBookingStore from "@/store/bookingStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BookingSearchPage() {
  const router = useRouter();
  const {
    searchCriteria,
    setSearchCriteria,
    shuttleResults,
    setShuttleResults,
    setSelectedShuttle,
  } = useBookingStore();

  // Instead of local states, read directly from the store:
  const { fromStop, toStop, shift, day } = searchCriteria;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If you want to auto-fetch on mount if the store has valid criteria:
  useEffect(() => {
    if (fromStop && toStop && shift && day) {
      doFetchShuttles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doFetchShuttles() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/bookings/search?fromStop=${encodeURIComponent(fromStop)}&toStop=${encodeURIComponent(toStop)}&shift=${encodeURIComponent(shift)}&day=${encodeURIComponent(day)}`
      );
      if (!res.ok) {
        setError("Failed to fetch available shuttles");
        return;
      }
      const data = await res.json();
      setShuttleResults(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching shuttles");
    } finally {
      setLoading(false);
    }
  }

  // If the user wants to manually update the fields or re-search:
  function handleSearch(e) {
    e.preventDefault();
    if (!fromStop || !toStop || !shift || !day) {
      setError("Please fill all fields");
      return;
    }
    doFetchShuttles();
  }

  function handleBookNow(shuttle) {
    setSelectedShuttle(shuttle);
    router.push("/bookings/confirm");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Shuttles</h1>

      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div>
          <label>From Stop:</label>
          <input
            type="text"
            value={fromStop}
            onChange={(e) =>
              setSearchCriteria({ fromStop: e.target.value })
            }
            className="border p-1"
          />
        </div>
        <div>
          <label>To Stop:</label>
          <input
            type="text"
            value={toStop}
            onChange={(e) =>
              setSearchCriteria({ toStop: e.target.value })
            }
            className="border p-1"
          />
        </div>
        <div>
          <label>Shift:</label>
          <select
            value={shift}
            onChange={(e) =>
              setSearchCriteria({ shift: e.target.value })
            }
            className="border p-1"
          >
            <option value="">Select shift</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="latenight">Late Night</option>
          </select>
        </div>
        <div>
          <label>Day:</label>
          <select
            value={day}
            onChange={(e) =>
              setSearchCriteria({ day: e.target.value })
            }
            className="border p-1"
          >
            <option value="">Select day</option>
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shuttleResults.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Available Shuttles</h2>
          <div className="grid grid-cols-1 gap-4">
            {shuttleResults.map((shuttle) => (
              <Card key={shuttle.shuttleId} className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{shuttle.shuttleName}</CardTitle>
                    <Badge className="bg-slate-800">₹{shuttle.fare} fare</Badge>
                  </div>
                  <CardDescription>
                    {fromStop} to {toStop}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="text-sm text-slate-500">Departure</div>
                        <div>{new Date(shuttle.departureTime).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="text-sm text-slate-500">Arrival</div>
                        <div>{new Date(shuttle.arrivalTime).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-slate-800 hover:bg-slate-700"
                    onClick={() => handleBookNow(shuttle)}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

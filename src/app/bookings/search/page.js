"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { 
  ClockIcon, 
  MapPinIcon, 
  CalendarIcon, 
  WalletIcon, 
  SearchIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  InfoIcon,
  UserIcon,
  UserRoundCheck,
  AlertCircleIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

export default function BookingSearchPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
  const [walletBalance, setWalletBalance] = useState(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [userGender, setUserGender] = useState("prefer-not-to-say");
  const [showWomenOnly, setShowWomenOnly] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [updatingGender, setUpdatingGender] = useState(false);

  // Fetch wallet balance and user data when session is loaded
  useEffect(() => {
    if (status === "authenticated" && session?.user?.userId) {
      fetchWalletBalance();
      fetchUserProfile();
    }
  }, [status, session]);

  // If you want to auto-fetch on mount if the store has valid criteria:
  useEffect(() => {
    if (fromStop && toStop && shift && day) {
      doFetchShuttles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUserProfile() {
    if (!session?.user?.userId) return;
    
    try {
      const res = await fetch(`/api/user/profile?userId=${session.user.userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.gender) {
          setUserGender(data.gender);
          // Only female users can see the women-only shuttle option
          if (data.gender === "female") {
            setShowGenderModal(false);
          }
        } else {
          // If gender not set, show the modal to set it
          setShowGenderModal(true);
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }

  async function updateUserGender(gender) {
    if (!session?.user?.userId) return;
    
    setUpdatingGender(true);
    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.userId,
          gender
        })
      });
      
      if (res.ok) {
        setUserGender(gender);
        setShowGenderModal(false);
      } else {
        console.error("Failed to update gender");
      }
    } catch (err) {
      console.error("Error updating gender:", err);
    } finally {
      setUpdatingGender(false);
    }
  }

  async function fetchWalletBalance() {
    if (!session?.user?.userId) return;
    
    setIsLoadingWallet(true);
    try {
      const res = await fetch(`/api/user/wallet?userId=${session.user.userId}`);
      if (!res.ok) {
        console.error("Failed to fetch wallet balance");
        return;
      }
      const data = await res.json();
      setWalletBalance(data.walletBalance);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
    } finally {
      setIsLoadingWallet(false);
    }
  }

  async function doFetchShuttles() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/bookings/search?fromStop=${encodeURIComponent(fromStop)}&toStop=${encodeURIComponent(toStop)}&shift=${encodeURIComponent(shift)}&day=${encodeURIComponent(day)}&gender=${encodeURIComponent(userGender)}&showWomenOnly=${showWomenOnly}`
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Gender Selection Modal */}
      {showGenderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Please Select Your Gender</CardTitle>
              <CardDescription>This helps us offer you appropriate shuttle options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                We offer women-only shuttles for increased safety and comfort. Your selection helps us show you the right options.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 h-16 ${userGender === "male" ? "border-slate-800 bg-slate-50" : ""}`}
                  onClick={() => updateUserGender("male")}
                  disabled={updatingGender}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Male</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 h-16 ${userGender === "female" ? "border-slate-800 bg-slate-50" : ""}`}
                  onClick={() => updateUserGender("female")}
                  disabled={updatingGender}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Female</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 h-16 ${userGender === "other" ? "border-slate-800 bg-slate-50" : ""}`}
                  onClick={() => updateUserGender("other")}
                  disabled={updatingGender}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Other</span>
                </Button>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 h-16 ${userGender === "prefer-not-to-say" ? "border-slate-800 bg-slate-50" : ""}`}
                  onClick={() => updateUserGender("prefer-not-to-say")}
                  disabled={updatingGender}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Prefer not to say</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => setShowGenderModal(false)}
                className="bg-slate-800 hover:bg-slate-700"
                disabled={updatingGender}
              >
                {updatingGender ? "Updating..." : "Continue"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Find Your Shuttle</h1>
        
        {status === "authenticated" && (
          <div className="flex items-center gap-3 bg-slate-50 py-2 px-4 rounded-lg border border-slate-200 shadow-sm">
            <WalletIcon className="h-5 w-5 text-green-600" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Wallet Balance</span>
              {isLoadingWallet ? (
                <span className="text-sm font-medium">Loading...</span>
              ) : (
                <span className="text-lg font-medium text-green-600">₹{walletBalance ?? 0}</span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-500 hover:text-slate-800"
              onClick={() => router.push("/dashboard/wallet")}
            >
              Top up
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Search Form */}
        <Card className="border-slate-200 shadow-sm md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Search Criteria</CardTitle>
            <CardDescription>Find shuttles that match your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fromStop" className="text-slate-700">
                  From Stop
                </Label>
                <Input
                  id="fromStop"
                  type="text"
                  value={fromStop}
                  onChange={(e) =>
                    setSearchCriteria({ fromStop: e.target.value })
                  }
                  className="border-slate-200 focus-visible:ring-slate-500"
                  placeholder="Enter pickup location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toStop" className="text-slate-700">
                  To Stop
                </Label>
                <Input
                  id="toStop"
                  type="text"
                  value={toStop}
                  onChange={(e) =>
                    setSearchCriteria({ toStop: e.target.value })
                  }
                  className="border-slate-200 focus-visible:ring-slate-500"
                  placeholder="Enter destination"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shift" className="text-slate-700">
                  Shift
                </Label>
                <Select
                  value={shift}
                  onValueChange={(value) => setSearchCriteria({ shift: value })}
                >
                  <SelectTrigger className="border-slate-200 focus:ring-slate-500">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="latenight">Late Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="day" className="text-slate-700">
                  Day
                </Label>
                <Select
                  value={day}
                  onValueChange={(value) => setSearchCriteria({ day: value })}
                >
                  <SelectTrigger className="border-slate-200 focus:ring-slate-500">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekday">Weekday</SelectItem>
                    <SelectItem value="weekend">Weekend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Women-only shuttle option - only visible for female users */}
              {userGender === "female" && (
                <div className="pt-2 pb-1">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="women-only" className="text-slate-700">
                        Women-only Shuttles
                      </Label>
                      <p className="text-xs text-slate-500">
                        Show only women-only shuttles for enhanced safety
                      </p>
                    </div>
                    <Switch
                      id="women-only"
                      checked={showWomenOnly}
                      onCheckedChange={setShowWomenOnly}
                    />
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-slate-800 hover:bg-slate-700 mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <SearchIcon className="h-4 w-4" />
                    Search Shuttles
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="md:col-span-8">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {shuttleResults.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>Available Shuttles</span>
                <Badge className="ml-2 bg-slate-100 text-slate-800 hover:bg-slate-200">
                  {shuttleResults.length} found
                </Badge>
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {shuttleResults.map((shuttle) => (
                  <Card 
                    key={shuttle.shuttleId} 
                    className={`border-slate-200 shadow-sm hover:shadow transition-shadow ${shuttle.isRestricted ? 'border-pink-200 bg-pink-50/30' : ''}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <CardTitle>{shuttle.shuttleName}</CardTitle>
                          {shuttle.shuttleType === "women-only" && (
                            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
                              Women Only
                            </Badge>
                          )}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">₹{shuttle.fare}</Badge>
                                <InfoIcon className="h-4 w-4 text-slate-400" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white border border-slate-200 shadow-md p-3 max-w-xs">
                              <div className="text-sm space-y-1">
                                <p className="font-medium">Fare Details:</p>
                                <p className="text-xs text-slate-600">Base fare: ₹{shuttle.fareDetails?.baseFare}</p>
                                <p className="text-xs text-slate-600">Time factor: {Math.round(shuttle.fareDetails?.timeOfDayFactor * 100)}%</p>
                                <p className="text-xs text-slate-600">Day factor: {Math.round(shuttle.fareDetails?.dayFactor * 100)}%</p>
                                <p className="text-xs text-slate-600">Availability: {Math.round(shuttle.fareDetails?.availabilityFactor * 100)}%</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <CardDescription className="flex items-center gap-1.5">
                        <span>{fromStop}</span>
                        <ArrowRightIcon className="h-3 w-3" />
                        <span>{toStop}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 p-1.5 rounded-full">
                            <ClockIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Departure</div>
                            <div className="text-sm">{new Date(shuttle.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="text-xs text-slate-500">{new Date(shuttle.departureTime).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-50 p-1.5 rounded-full">
                            <ClockIcon className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Arrival</div>
                            <div className="text-sm">{new Date(shuttle.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="text-xs text-slate-500">{new Date(shuttle.arrivalTime).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Restriction message for women-only shuttles */}
                      {shuttle.isRestricted && (
                        <div className="mt-3 flex items-center gap-2 rounded-md border border-pink-200 bg-pink-50 p-2 text-sm text-pink-800">
                          <AlertCircleIcon className="h-4 w-4 text-pink-600" />
                          <span className="font-medium">{shuttle.restrictionReason}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-1">
                          {shuttle.shuttleType === "women-only" ? (
                            <>
                              <UserRoundCheck className="h-3.5 w-3.5 text-pink-600" />
                              <span className="text-xs text-slate-500">Women only shuttle</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheckIcon className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs text-slate-500">Confirmed seating</span>
                            </>
                          )}
                        </div>
                        
                        {shuttle.isRestricted ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Button
                                    className="bg-pink-200 text-pink-800 cursor-not-allowed hover:bg-pink-200"
                                    disabled={true}
                                  >
                                    Restricted
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white border border-slate-200 shadow-md p-3">
                                <div className="text-sm space-y-1">
                                  <p>Women-only shuttle. Only female passengers can book.</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Button
                            className="bg-slate-800 hover:bg-slate-700"
                            onClick={() => handleBookNow(shuttle)}
                          >
                            Book Now
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : !loading && !error ? (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-300 rounded-lg bg-slate-50">
              <SearchIcon className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-slate-500">Use the search form to find available shuttles</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

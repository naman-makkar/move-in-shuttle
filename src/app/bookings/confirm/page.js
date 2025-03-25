"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import useBookingStore from "@/store/bookingStore";
import QRCode from "react-qr-code";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
  TicketIcon,
  UserIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CalendarIcon,
  InfoIcon,
  PhoneIcon,
  BusIcon,
  WalletIcon,
  ShieldCheckIcon,
  DownloadIcon,
  Share2Icon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function BookingConfirmPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { searchCriteria, selectedShuttle } = useBookingStore();
  const qrCodeRef = useRef(null);

  // We'll fetch stop details so we can show "stopName" instead of IDs
  const [fromStopDetails, setFromStopDetails] = useState(null);
  const [toStopDetails, setToStopDetails] = useState(null);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [qrDownloadSuccess, setQrDownloadSuccess] = useState(false);

  // If we have a bookingId, we treat that as success
  const [bookingId, setBookingId] = useState("");
  const success = !!bookingId; // success is true if bookingId is not empty

  // If no shuttle is selected, redirect back to search
  useEffect(() => {
    if (!selectedShuttle) {
      router.push("/bookings/search");
    }
  }, [selectedShuttle, router]);

  // Fetch from/to stop names from /api/admin/stops
  useEffect(() => {
    async function fetchStopDetails() {
      try {
        const res = await fetch("/api/admin/stops");
        if (res.ok) {
          const stopsData = await res.json();
          setFromStopDetails(
            stopsData.find((s) => s.stopId === searchCriteria.fromStop)
          );
          setToStopDetails(
            stopsData.find((s) => s.stopId === searchCriteria.toStop)
          );
        }
      } catch (err) {
        console.error("Error fetching stop details:", err);
      }
    }
    if (searchCriteria.fromStop && searchCriteria.toStop) {
      fetchStopDetails();
    }
  }, [searchCriteria.fromStop, searchCriteria.toStop]);

  // Create booking details for QR code
  const generateQRCodeValue = () => {
    if (!bookingId) return "";
    
    const qrData = {
      bookingId,
      userId: session?.user?.userId,
      userName: session?.user?.name || "Student",
      fromStop: fromStopName,
      toStop: toStopName, 
      fare: selectedShuttle?.fare,
      date: bookingDate,
      shuttleId: selectedShuttle?.shuttleId
    };
    
    return JSON.stringify(qrData);
  };
  
  // Function to download QR code as SVG
  const downloadQRCode = () => {
    try {
      if (!qrCodeRef.current) return;
      
      // Get the SVG element
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (!svgElement) return;
      
      // Create a serialized SVG string
      const svgData = new XMLSerializer().serializeToString(svgElement);
      
      // Create a Blob from the SVG data
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      
      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `booking-${bookingId}.svg`;
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      setQrDownloadSuccess(true);
      setTimeout(() => setQrDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };
  
  // Function to share booking details
  const shareBooking = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Shuttle Booking',
          text: `I've booked a shuttle from ${fromStopName} to ${toStopName}. Booking ID: ${bookingId}`,
          url: window.location.href
        });
      } else {
        // Fallback - copy to clipboard
        const text = `I've booked a shuttle from ${fromStopName} to ${toStopName}. Booking ID: ${bookingId}`;
        await navigator.clipboard.writeText(text);
        alert('Booking details copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  async function handleConfirm() {
    if (status !== "authenticated" || !session?.user?.userId) {
      setMessage("Please sign in to confirm your booking");
      return;
    }
    try {
      setIsLoading(true);
      setMessage("");
      
      // Add progress animation
      let progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prevProgress + 5;
        });
      }, 150);
      
      const res = await fetch("/api/bookings/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.userId,
          shuttleId: selectedShuttle.shuttleId,
          fromStop: searchCriteria.fromStop,
          toStop: searchCriteria.toStop,
          fare: selectedShuttle.fare,
        }),
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const data = await res.json();
      if (res.ok) {
        setBookingId(data.booking.bookingId);
      } else {
        setMessage(data.error || "Failed to confirm booking");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while processing your booking");
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackClick() {
    router.back();
  }

  function handleViewBookings() {
    router.push("/bookings/my");
  }

  // Calculate estimated travel time (example - replace with actual calculation)
  const estimatedTravelTime = "30 mins"; // Could be calculated based on actual distance

  // Placeholder for shuttle details - can be replaced with actual data
  const shuttleDetails = {
    type: "Regular Shuttle",
    capacity: "20 seats",
    currentOccupancy: "8/20",
    amenities: "Air Conditioned, Wi-Fi",
    driverName: "Mr. Sharma",
    contact: "+91 98765-43210"
  };

  // Format date for display
  const bookingDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-slate-200 shadow-md">
          <CardContent className="p-10 flex flex-col items-center justify-center gap-4">
            <div className="w-full max-w-md">
              <Progress value={45} className="h-2 w-full" />
            </div>
            <p className="text-center text-slate-600">Loading booking information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fromStopName = fromStopDetails?.stopName || searchCriteria.fromStop;
  const toStopName = toStopDetails?.stopName || searchCriteria.toStop;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 text-center">
          {success ? "Booking Confirmed" : "Confirm Your Booking"}
        </h1>
        <p className="text-slate-500 text-center max-w-xl mx-auto">
          {success 
            ? "Your shuttle is booked and ready to go! Here are your booking details."
            : "Please review your booking details before confirming."
          }
        </p>
      </div>

      {message && (
        <Alert variant="destructive" className="mb-6 border-red-300 bg-red-50">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      {qrDownloadSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
          <CheckCircleIcon className="h-4 w-4" />
          <AlertDescription>QR code downloaded successfully!</AlertDescription>
        </Alert>
      )}

      {success ? (
        // -------------------------
        // SUCCESS STATE (Booking Confirmed)
        // -------------------------
        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2" />
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 text-green-700 p-3 rounded-full">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-center text-xl">Booking Successfully Confirmed</CardTitle>
            <CardDescription className="text-center max-w-md mx-auto mt-1">
              Your booking has been confirmed and is ready to go. Please save your booking ID for future reference.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-8">
            <div className="flex justify-center mb-6">
              <Badge className="text-lg py-2 px-5 bg-slate-800 hover:bg-slate-700 shadow-sm">
                Booking ID: {bookingId}
              </Badge>
            </div>
            
            {/* QR Code Section */}
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="mb-3 text-center">
                  <h3 className="text-sm font-medium text-slate-600">Scan QR Code for Booking Details</h3>
                </div>
                <div ref={qrCodeRef} className="flex justify-center p-3 bg-white rounded">
                  <QRCode 
                    value={generateQRCodeValue()}
                    size={180}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
                <div className="mt-3 text-center text-xs text-slate-500">
                  Show this to the shuttle driver for verification
                </div>
                <div className="mt-4 flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1.5"
                    onClick={downloadQRCode}
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    <span>Save QR Code</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1.5"
                    onClick={shareBooking}
                  >
                    <Share2Icon className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Journey Details */}
                <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <BusIcon className="h-4 w-4 text-slate-500" />
                      <span>Journey Details</span>
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 relative z-10">
                          <MapPinIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">From</div>
                          <div className="font-medium">{fromStopName}</div>
                        </div>
                      </div>
                      
                      <div className="absolute top-8 left-4 h-10 w-0.5 bg-slate-200"></div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 relative z-10">
                          <MapPinIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">To</div>
                          <div className="font-medium">{toStopName}</div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>Est. Travel Time</span>
                        </div>
                        <div className="font-medium">{estimatedTravelTime}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Date</span>
                        </div>
                        <div className="font-medium text-sm">{bookingDate}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <WalletIcon className="h-4 w-4 text-slate-500" />
                      <span>Payment Information</span>
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Fare Amount</span>
                      <span className="font-medium">₹{selectedShuttle?.fare}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Payment Status</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Payment Method</span>
                      <span className="font-medium">Wallet</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Shuttle Information */}
                <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <InfoIcon className="h-4 w-4 text-slate-500" />
                      <span>Shuttle Information</span>
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Shuttle ID</span>
                      <span className="font-medium">{selectedShuttle?.shuttleId}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Shuttle Type</span>
                      <span className="font-medium">{shuttleDetails.type}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Capacity</span>
                      <span className="font-medium">{shuttleDetails.capacity}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Occupancy</span>
                      <div className="flex items-center gap-2">
                        <Progress value={40} className="h-2 w-24" />
                        <span className="text-sm">{shuttleDetails.currentOccupancy}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Amenities</span>
                      <span className="font-medium text-sm">{shuttleDetails.amenities}</span>
                    </div>
                  </div>
                </div>
                
                {/* Passenger Information */}
                <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <UserIcon className="h-4 w-4 text-slate-500" />
                      <span>Passenger Information</span>
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Name</span>
                      <span className="font-medium">{session?.user?.name || "Student"}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">User ID</span>
                      <span className="font-medium">{session?.user?.userId}</span>
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-slate-500" />
                      <span>Important Information</span>
                    </h3>
                  </div>
                  <div className="p-4">
                    <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                      <InfoIcon className="h-4 w-4" />
                      <AlertDescription>
                        Please arrive at the pickup point 5 minutes before departure time. 
                        Show this booking confirmation to the driver.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-3 text-sm text-slate-600">
                      <p className="mb-2">For any assistance contact:</p>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-slate-500" />
                        <span>{shuttleDetails.driverName}: {shuttleDetails.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 bg-slate-50 border-t border-slate-100 px-6 py-4">
            <Button
              className="w-full bg-slate-800 hover:bg-slate-700"
              onClick={handleViewBookings}
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/bookings/request")}
            >
              Book Another Shuttle
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // -------------------------
        // NOT YET CONFIRMED
        // -------------------------
        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2" />
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle>Review Your Booking</CardTitle>
            <CardDescription>Please review and confirm your shuttle booking details</CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 py-8 space-y-6">
            {/* Progress bar for confirmation */}
            {isLoading && (
              <div className="mb-2">
                <p className="text-sm text-slate-500 mb-2">Processing your booking...</p>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {/* Journey Card */}
            <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                <h3 className="font-medium flex items-center gap-1.5">
                  <BusIcon className="h-4 w-4 text-slate-500" />
                  <span>Journey Details</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 relative z-10">
                      <MapPinIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">From</div>
                      <div className="font-medium">{fromStopName}</div>
                    </div>
                  </div>
                  
                  <div className="absolute top-8 left-4 h-10 w-0.5 bg-slate-200"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 relative z-10">
                      <MapPinIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">To</div>
                      <div className="font-medium">{toStopName}</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>Est. Travel Time</span>
                    </div>
                    <div className="font-medium">{estimatedTravelTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Date</span>
                    </div>
                    <div className="font-medium text-sm">{bookingDate}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shuttle & Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shuttle Details */}
              <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <h3 className="font-medium flex items-center gap-1.5">
                    <InfoIcon className="h-4 w-4 text-slate-500" />
                    <span>Shuttle Information</span>
                  </h3>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Shuttle ID</span>
                    <span className="font-medium">{selectedShuttle?.shuttleId}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Shuttle Type</span>
                    <span className="font-medium">{shuttleDetails.type}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Amenities</span>
                    <span className="font-medium text-sm">{shuttleDetails.amenities}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <h3 className="font-medium flex items-center gap-1.5">
                    <WalletIcon className="h-4 w-4 text-slate-500" />
                    <span>Payment Information</span>
                  </h3>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Fare Amount</span>
                    <span className="font-medium">₹{selectedShuttle?.fare}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Payment Method</span>
                    <span className="font-medium">Wallet</span>
                  </div>
                  <Separator />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between cursor-help">
                          <span className="text-slate-600">Cancellation Policy</span>
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            Free until 1 hour before
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">Free cancellation is available up to 1 hour before your journey. After that, a 50% cancellation fee applies.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            {/* User Information */}
            {status === "authenticated" ? (
              <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <h3 className="font-medium flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4 text-slate-500" />
                    <span>Passenger Information</span>
                  </h3>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Name</span>
                    <span className="font-medium">{session?.user?.name || "Student"}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">User ID</span>
                    <span className="font-medium">{session?.user?.userId}</span>
                  </div>
                </div>
              </div>
            ) : (
              <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Please sign in to continue with your booking.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 bg-slate-50 border-t border-slate-100 px-6 py-4">
            <Button
              className="w-full bg-slate-800 hover:bg-slate-700"
              onClick={handleConfirm}
              disabled={isLoading || status !== "authenticated"}
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleBackClick}
              disabled={isLoading}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Shuttles
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

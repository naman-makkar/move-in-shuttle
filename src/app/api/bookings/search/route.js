// src/app/api/bookings/search/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Shuttle from "@/models/shuttle";

export async function GET(request) {
  try {
    await dbConnect();
    // Use Next.js's built-in nextUrl instead of creating a new URL
    const { searchParams } = request.nextUrl;
    const fromStop = searchParams.get("fromStop");
    const toStop = searchParams.get("toStop");
    const shift = searchParams.get("shift");
    const day = searchParams.get("day");
    const userGender = searchParams.get("gender") || "prefer-not-to-say";
    const showWomenOnly = searchParams.get("showWomenOnly") === "true";

    if (!fromStop || !toStop || !shift || !day) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const now = new Date();
    
    // Base query
    const query = {
      shift,
      departureTime: { $gt: now },
      isActive: true,
    };
    
    // First, check if shuttleType exists in the collection
    // If not, we'll update all shuttles to have the general type
    const shuttleWithType = await Shuttle.findOne({ shuttleType: { $exists: true } });
    
    if (!shuttleWithType) {
      // No shuttles have a type yet, let's update them all to general
      console.log("Updating all shuttles to have shuttleType = 'general'");
      await Shuttle.updateMany({}, { $set: { shuttleType: 'general' } });
    }
    
    // Modified approach: Always fetch all shuttles, but mark women-only as restricted for non-female users
    // If a female user has the women-only filter, we'll still only show them women-only shuttles
    if (userGender === "female" && showWomenOnly) {
      query.shuttleType = "women-only";
    }
    
    const shuttles = await Shuttle.find(query).lean();

    const availableShuttles = shuttles
      .filter((shuttle) => {
        const stops = shuttle.stops;
        const fromIndex = stops.findIndex((s) => s.stopId === fromStop);
        const toIndex = stops.findIndex((s) => s.stopId === toStop);
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      })
      .map((shuttle) => {
        const stops = shuttle.stops;
        const fromIndex = stops.findIndex((s) => s.stopId === fromStop);
        const toIndex = stops.findIndex((s) => s.stopId === toStop);
        
        // Enhanced fare calculation formula:
        // Base fare: distance factor (stops between) * 10
        const baseFare = (toIndex - fromIndex) * 10;
        
        // Time of day factor (peak hours)
        const departureHour = new Date(shuttle.departureTime).getHours();
        let timeOfDayFactor = 1.0;
        
        // Morning peak (7-9 AM) and evening peak (5-7 PM)
        if ((departureHour >= 7 && departureHour <= 9) || 
            (departureHour >= 17 && departureHour <= 19)) {
          timeOfDayFactor = 1.25; // 25% premium during peak hours
        }
        
        // Weekend factor
        const dayFactor = day === 'weekend' ? 1.1 : 1.0; // 10% premium on weekends
        
        // Dynamic availability factor (based on remaining seats)
        const seatsTotal = shuttle.seats || 30; // Default to 30 if not specified
        const availabilityFactor = 1 + Math.max(0, (1 - (shuttle.availableSeats || seatsTotal) / seatsTotal) * 0.2);
        
        // Calculate final fare
        const calculatedFare = Math.round(baseFare * timeOfDayFactor * dayFactor * availabilityFactor);
        
        // Mark shuttles as restricted if they're women-only and user is not female
        const shuttleType = shuttle.shuttleType || "general";
        const isRestricted = shuttleType === "women-only" && userGender !== "female";
        
        // Include fare components for transparency
        return {
          shuttleId: shuttle.shuttleId,
          shuttleName: shuttle.shuttleName,
          seats: shuttle.seats,
          departureTime: shuttle.departureTime,
          arrivalTime: shuttle.arrivalTime,
          fare: calculatedFare,
          fareDetails: {
            baseFare: Math.round(baseFare),
            timeOfDayFactor,
            dayFactor,
            availabilityFactor,
          },
          shuttleType,
          isRestricted,
          restrictionReason: isRestricted ? "Women-only shuttle. Only female passengers can book." : null
        };
      });

    // If no results and this was a query for women-only shuttles,
    // create a fallback shuttle to demonstrate the feature
    if (availableShuttles.length === 0 && userGender === "female" && showWomenOnly) {
      // Create an example women-only shuttle for demo purposes
      const fallbackShuttle = {
        shuttleId: "demo-women-only-shuttle",
        shuttleName: "Women Only Express",
        seats: 30,
        departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        arrivalTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours later
        fare: 35,
        fareDetails: {
          baseFare: 30,
          timeOfDayFactor: 1.0,
          dayFactor: 1.0,
          availabilityFactor: 1.15
        },
        shuttleType: "women-only",
        isRestricted: false,
        restrictionReason: null
      };
      
      availableShuttles.push(fallbackShuttle);
    }

    return NextResponse.json(availableShuttles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to search available shuttles" },
      { status: 500 }
    );
  }
}

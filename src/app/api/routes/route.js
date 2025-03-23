// import { NextResponse } from 'next/server';

// // Predefined locations for shuttles in Greater Noida
// const stopLocations = {
// 	'Pari Chowk': { lat: 28.4651, lng: 77.503 },
// 	Depot: { lat: 28.4757, lng: 77.5047 },
// 	'Bennett University': { lat: 28.4496, lng: 77.5858 },
// 	'Delta 1': { lat: 28.4755, lng: 77.5044 }
// };

// // Sample routes data
// const routes = [
// 	{
// 		id: '1',
// 		name: 'Bennett Express',
// 		from: 'Pari Chowk',
// 		to: 'Bennett University',
// 		shuttles: ['Shuttle A', 'Shuttle B'],
// 		price: 30,
// 		duration: '25 mins',
// 		distance: '12 km',
// 		schedule: [
// 			{ departure: '07:30', arrival: '07:55' },
// 			{ departure: '09:00', arrival: '09:25' },
// 			{ departure: '12:30', arrival: '12:55' },
// 			{ departure: '16:00', arrival: '16:25' }
// 		]
// 	},
// 	{
// 		id: '2',
// 		name: 'Depot Direct',
// 		from: 'Pari Chowk',
// 		to: 'Depot',
// 		shuttles: ['Shuttle C'],
// 		price: 15,
// 		duration: '10 mins',
// 		distance: '5 km',
// 		schedule: [
// 			{ departure: '08:00', arrival: '08:10' },
// 			{ departure: '10:00', arrival: '10:10' },
// 			{ departure: '14:00', arrival: '14:10' },
// 			{ departure: '18:00', arrival: '18:10' }
// 		]
// 	},
// 	{
// 		id: '3',
// 		name: 'Delta Line',
// 		from: 'Bennett University',
// 		to: 'Delta 1',
// 		shuttles: ['Shuttle D', 'Shuttle E'],
// 		price: 35,
// 		duration: '30 mins',
// 		distance: '15 km',
// 		schedule: [
// 			{ departure: '08:30', arrival: '09:00' },
// 			{ departure: '11:30', arrival: '12:00' },
// 			{ departure: '15:30', arrival: '16:00' },
// 			{ departure: '19:00', arrival: '19:30' }
// 		]
// 	},
// 	{
// 		id: '4',
// 		name: 'Campus Connect',
// 		from: 'Depot',
// 		to: 'Bennett University',
// 		shuttles: ['Shuttle F'],
// 		price: 25,
// 		duration: '20 mins',
// 		distance: '9 km',
// 		schedule: [
// 			{ departure: '07:45', arrival: '08:05' },
// 			{ departure: '10:30', arrival: '10:50' },
// 			{ departure: '13:30', arrival: '13:50' },
// 			{ departure: '17:30', arrival: '17:50' }
// 		]
// 	},
// 	{
// 		id: '5',
// 		name: 'Greater Noida Express',
// 		from: 'Delta 1',
// 		to: 'Pari Chowk',
// 		shuttles: ['Shuttle G', 'Shuttle H'],
// 		price: 25,
// 		duration: '22 mins',
// 		distance: '10 km',
// 		schedule: [
// 			{ departure: '07:15', arrival: '07:37' },
// 			{ departure: '09:45', arrival: '10:07' },
// 			{ departure: '13:15', arrival: '13:37' },
// 			{ departure: '16:45', arrival: '17:07' }
// 		]
// 	}
// ];

// export async function GET(request) {
// 	try {
// 		// Get the search params from the request URL
// 		const searchParams = request.nextUrl.searchParams;
// 		const fromStopParam = searchParams.get('from');
// 		const toStopParam = searchParams.get('to');

// 		let filteredRoutes = [...routes];

// 		// Filter by from stop if provided
// 		if (fromStopParam) {
// 			filteredRoutes = filteredRoutes.filter(
// 				(route) => route.from.toLowerCase() === fromStopParam.toLowerCase()
// 			);
// 		}

// 		// Filter by to stop if provided
// 		if (toStopParam) {
// 			filteredRoutes = filteredRoutes.filter(
// 				(route) => route.to.toLowerCase() === toStopParam.toLowerCase()
// 			);
// 		}

// 		// Add stop coordinates to each route
// 		const routesWithCoordinates = filteredRoutes.map((route) => ({
// 			...route,
// 			fromCoordinates: stopLocations[route.from],
// 			toCoordinates: stopLocations[route.to]
// 		}));

// 		// Return the routes data
// 		return NextResponse.json({
// 			routes: routesWithCoordinates,
// 			stops: Object.keys(stopLocations).map((name) => ({
// 				name,
// 				coordinates: stopLocations[name]
// 			}))
// 		});
// 	} catch (error) {
// 		console.error('Error fetching routes:', error);
// 		return NextResponse.json(
// 			{ error: 'Failed to fetch routes data' },
// 			{ status: 500 }
// 		);
// 	}
// }

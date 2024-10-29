// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
// import LocationIcon from './locationIcon';
import SubLocationIcon from './subLocationIcon';


//search 
import React, { useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline  } from 'react-leaflet';
// import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import LocationIcon from './locationIcon';
import polyline from '@mapbox/polyline';

import axios from 'axios';

// Define a function for geocoding
const geocodeCity = async (city) => {
    const apiKey = "AIzaSyAzdhyPxaVbkqp6FMGR4IdJ_-P1GDBNjcU";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
    const response = await fetch(url);
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
        return data.results[0].geometry.location;
    } else {
        throw new Error(`Coordinates not found for city: ${city}`);
    }
};

// Main component
const RouteMap = ({routeId}) => {

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    //search
    const [sourcePosition, setSourcePosition] = useState([7.8731, 80.7718]); // Default center
    const [destinationPosition, setDestinationPosition] = useState([51.505, -0.09]); // Default center
    const [sourceLocation, setSourceLocation] = useState(""); // User input for location name
    const [destinationLocation, setDestinationLocation] = useState(""); // User input for location name
    const [routePathDecode, setRoutePathDecode] = useState([]); // Route coordinates
    const [routePathEncode, setRoutePathEncode] = useState([]); // Route coordinates
    const [routeSegment, setRouteSegment] = useState([]); // Route coordinates
    const [error, setError] = useState("");

    
    const fetchRouteData = async () => {
        try {
            // Fetch route data from backend
            const response = await axios.post('http://localhost:8080/api/get-route', {
                sourceLocation,
                destinationLocation
            });
            
            //const response = await fetch(`http://localhost:8080/api/get-route/${routeId}`);
            const {route} = response.data;

            // Gather all cities
            const cities = [route.source, ...route.stops, route.destination];
            const coords = [];

            // Fetch coordinates for each city
            for (const city of cities) {
                const location = await geocodeCity(city);
                
                coords.push({ name: city, coords: [location.lat, location.lng] });
            }

            //
            const segments = [];

            for (let i = 0; i < cities.length - 1; i++) {
                const sourceLocation = (cities[i]);
                const destinationLocation = (cities[i + 1]);

                const response = await axios.post('http://localhost:8080/api/get-location-code-search-by-name', {
                                sourceLocation,
                                destinationLocation
                            });
                
                console.log(response);

                if (response.data) {

                    const { sourceLocation, destinationLocation, route } = response.data;
                    
                    let tempRoutPath = [route]

                    segments.push(tempRoutPath);

                    setError("");
                } else {
                    setError("One or both locations not found or route not available.");
                }
                // Each segment has start and end coordinates
            }
            
            setRouteSegment(segments);
            console.log(routeSegment)

            setLocations(coords);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching route or coordinates:', error);
            setLoading(false);
        }
    };

    if (loading) return (<>
        <input
                type="text"
                value={sourceLocation}
                placeholder="Enter source location name"
                onChange={(e) => setSourceLocation(e.target.value)}
            />
            <input
                type="text"
                value={destinationLocation}
                placeholder="Enter destination location name"
                onChange={(e) => setDestinationLocation(e.target.value)}
            />

            <button onClick={fetchRouteData}>Find Location</button>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <MapContainer center={sourcePosition} zoom={8} style={{ height: "100vh", width: "100%" }}>

               <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
    </>);

    return (
        <>
            <input
                type="text"
                value={sourceLocation}
                placeholder="Enter source location name"
                onChange={(e) => setSourceLocation(e.target.value)}
            />
            <input
                type="text"
                value={destinationLocation}
                placeholder="Enter destination location name"
                onChange={(e) => setDestinationLocation(e.target.value)}
            />

            <button onClick={fetchRouteData}>Find Location</button>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <MapContainer center={locations[0].coords} zoom={10} style={{ height: '500px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Plot markers and polyline */}
                {
                    locations.map((location, index) => {
                        
                        if(index === 0 ) {
                            return (
                                <>
                                    <Marker key={index} position={location.coords} icon={LocationIcon}>
                                        <Popup>
                                            Starts : {location.name}
                                        </Popup>
                                    </Marker>
                                    <MapZoomCenter position={locations[0].coords} />
                                </>
                            )
                        }
                        else if(index === locations.length-1) {
                            return (
                                <>
                                    <Marker key={index} position={location.coords} icon={LocationIcon}>
                                        <Popup>
                                            Ends : {location.name}
                                        </Popup>
                                    </Marker>
                                    <MapZoomCenter position={locations[0].coords} />
                                </>
                            )
                        }
                        else {
                            return (
                                <>
                                    <Marker key={index} position={location.coords} icon={SubLocationIcon}>
                                        <Popup>{location.name}</Popup>
                                    </Marker>
                                    <MapZoomCenter position={locations[0].coords} />
                                </>
                            )
                        }    
                    })
                }
                {
                    (routeSegment.length > 0 && (
                        <Polyline
                            positions={routeSegment.map((seg, index) => {
                                const decode = polyline.decode(seg[0]).map(([lat, lng]) => ({lat,lng}))
                                return (decode);
                            })}
                            color="blue"
                            weight={4}
                            opacity={0.3}
                        />
                    ))
                }
            </MapContainer>
        </>
    );
};

//search
const MapZoomCenter = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 11); // Set the view to user's location with zoom level 15
        }
    }, [position, map]);

    return null;
};

export default RouteMap;
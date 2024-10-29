import React, { useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline  } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import LocationIcon from './locationIcon';
import polyline from '@mapbox/polyline';

const MapWithGoogleGeocoding = () => {
    const [sourcePosition, setSourcePosition] = useState([51.505, -0.09]); // Default center
    const [destinationPosition, setDestinationPosition] = useState([51.505, -0.09]); // Default center
    const [sourceLocation, setSourceLocation] = useState(""); // User input for location name
    const [destinationLocation, setDestinationLocation] = useState(""); // User input for location name
    const [routePathDecode, setRoutePathDecode] = useState([]); // Route coordinates
    const [routePathEncode, setRoutePathEncode] = useState([]); // Route coordinates
    const [error, setError] = useState("");

    // Function to fetch coordinates from Google Geocoding API
    const geocodeLocation = async () => {
        
        try {
            const response = await axios.post('http://localhost:8080/api/get-location-code-search-by-name', {
                sourceLocation,
                destinationLocation
            });

            if (response.data) {

                const { sourceLocation, destinationLocation, route } = response.data;
                console.log(sourceLocation)
                console.log(destinationLocation)
                console.log(route)

                console.log(route)
                
                setSourcePosition([sourceLocation.lat, sourceLocation.lng]);
                setDestinationPosition([destinationLocation.lat, destinationLocation.lng]);
                setRoutePathEncode(route);
                setError("");
            } else {
                setError("One or both locations not found or route not available.");
            }
        } catch (err) {
            console.error("Error fetching location:", err);
            setError("Error fetching location");
        }
    };

    useEffect(() => {
        // Decode the polyline path and map each point to an object with lat/lng properties
        if (routePathEncode) {
            
            const decodedPath = polyline.decode(routePathEncode).map(([lat, lng]) => (
                { lat, lng }
            ));

            console.log(decodedPath)
            setRoutePathDecode(decodedPath);
        }
    }, [routePathEncode]); // Only run when routePathEncode changes

    return (
        <div>
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
            <button onClick={geocodeLocation}>Find Location</button>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <MapContainer center={sourcePosition} zoom={13} style={{ height: "100vh", width: "100%" }}>

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapZoomCenter position={sourcePosition} />
                
                <Marker position={sourcePosition} icon={LocationIcon}>
                    <Popup>Location: {sourceLocation || "Default location"}</Popup>
                </Marker>
                
                <Marker position={destinationPosition} icon={LocationIcon}>
                    <Popup>Location: {destinationLocation || "Default location"}</Popup>
                </Marker>
                
                {/* Highlighted Route Line */}
                {routePathDecode.length > 0 && (
                    <Polyline
                        positions={routePathDecode}
                        color="blue"
                        weight={4}
                        opacity={0.7}
                    />
                )}
            </MapContainer>
        </div>
    );
};

const MapZoomCenter = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 12); // Set the view to user's location with zoom level 15
        }
    }, [position, map]);

    return null;
};

export default MapWithGoogleGeocoding;

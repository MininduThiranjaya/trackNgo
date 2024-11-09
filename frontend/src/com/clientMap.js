import SubLocationIcon from './mapIcon/subLocationIcon';

//search 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationIcon from './mapIcon/locationIcon';
import polyline from '@mapbox/polyline';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import UserLocateButoonCustom from './userLocateButton_custom';

// Define a function for geocoding
const geocodeCity = async (city) => {
    const apiKey = "AIzaSyAiQ_WJER_3HDCs0B6tH01WPTCzB1COSLA";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
    const response = await fetch(url);
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
        return data.results[0].geometry.location;
    } else {
        throw new Error(`Coordinates not found for city: ${city}`);
    }
};

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Main component
export default function ClientMap({routeId}) {

    console.log(routeId)

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    //search
    // const [destinationPosition, setDestinationPosition] = useState([51.505, -0.09]); // Default center
    // const [routePathDecode, setRoutePathDecode] = useState([]); // Route coordinates
    // const [routePathEncode, setRoutePathEncode] = useState([]); // Route coordinates
    const [sourcePosition, setSourcePosition] = useState([7.8731, 80.7718]); // Default center
    const [routeSegment, setRouteSegment] = useState([]); // Route coordinates

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchRouteData = async (routeId) => {

         try {
            // Fetch route data from backend
            const response = await axios.post('http://localhost:8080/api/get-specific-bus-route', {
                routeId
            });
            
            const {specificBusRoute} = response.data;

            // Gather all cities
            const cities = [specificBusRoute.source, ...specificBusRoute.stops, specificBusRoute.destination];
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
    }

     fetchRouteData(routeId);

    },[]);

    if (loading) return (
    <>
        <Container fluid>
            <Row className="justify-content-center mt-3">
                <Col xs={12} md={12} lg={12} style={{ height: '400px'}}>
                    <MapContainer center={sourcePosition} zoom={8} style={{ height: "100vh", width: "100%" }}>
                    <UserLocateButoonCustom/>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        
                    </MapContainer>
                </Col>
            </Row>
        </Container>
    </>);

    return (
        <>
            <Container fluid>
                <Row className="justify-content-center mt-3">
                    <Col xs={12} md={12} lg={12} style={{ height: '400px', position: 'relative' }}>
                        <MapContainer center={locations[0].coords} zoom={10} style={{ height: '500px', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            <UserLocateButoonCustom/>

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
                                        opacity={0.5}
                                    />
                                ))
                            }
                        </MapContainer>
                    </Col>
                </Row>
            </Container>
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
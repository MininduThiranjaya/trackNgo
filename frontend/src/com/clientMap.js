

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline} from 'react-leaflet';
import React, { useState, useEffect} from 'react';
import polyline from '@mapbox/polyline';
import axios from 'axios';

//Styles
import 'leaflet/dist/leaflet.css';
import { Container, Row, Col} from 'react-bootstrap';

//Custom made button for find user current location
import UserLocateButoonCustom from './userLocateButton_custom';

//Map icons
import LocationIcon from './mapIcon/locationIcon';
import SubLocationIcon from './mapIcon/subLocationIcon';

//Bus live location component
import BusLiveLocation from './busLiveLocation';

// Main component
export default function ClientMap({busRouteId,busNumber}) {

    // console.log(busRouteId)
    // console.log(busNumber)

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    // Sri lanka location
    const sourcePosition = [7.8731, 80.7718];
    // Route coordinates
    const [routeSegment, setRouteSegment] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchRouteData = async (busRouteId) => {

         try {
            // Fetch route data from backend
            const response = await axios.post('https://eada-192-248-57-153.ngrok-free.app/api-user/get-specific-bus-route', {
                busRouteId
            });
            
            const {specificBusRoute} = response.data;

            // Gather all cities
            const cities = [specificBusRoute.startLocation, ...specificBusRoute.routeStops, specificBusRoute.endLocation];
            const coords = [];

            // Fetch coordinates for each city
            for (const city of cities) {
                const location = await geocodeCity(city);
                
                coords.push({ name: city, coords: [location.lat, location.lng] });
                console.log({ name: city, coords: [location.lat, location.lng] });
            }

            //
            const segments = [];

            for (let i = 0; i < cities.length - 1; i++) {
                const startLocation = (cities[i]);
                const endLocation = (cities[i + 1]);

                const response = await axios.post('https://eada-192-248-57-153.ngrok-free.app/api-user/get-location-code-search-by-name', {
                    startLocation,
                    endLocation
                });
                
                // console.log(response);

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
            // console.log(routeSegment)

            setLocations(coords);
            setLoading(true);
        } catch (error) {
            console.error('Error fetching route or coordinates:', error);
            setLoading(false);
        }
    }

     fetchRouteData(busRouteId);

    },[]);

    return (
        (
            !loading ? (
                <h1>Loading...</h1>//need to add the loading effects
            ):(
                <>
                    <Container fluid>
                        <Row className="justify-content-center mt-3">
                            <Col xs={12} md={12} lg={12} style={{ height: '400px', position: 'relative' }}>
                                <MapContainer center={locations[0].coords} zoom={10} style={{ height: '700px', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                    
                                    <UserLocateButoonCustom/>

                                    <BusLiveLocation busId={busNumber}/>

                                    {/* Plot markers on the map and draw route path using polyline */}
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
                                                        {/* <MapZoomCenter position={locations[0].coords} /> */}
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
                                                    </>
                                                )
                                            }
                                            else {
                                                return (
                                                    <>
                                                        <Marker key={index} position={location.coords} icon={SubLocationIcon}>
                                                            <Popup>{location.name}</Popup>
                                                        </Marker>
                                                    </>
                                                )
                                            }    
                                        })
                                    }
                                    {
                                        (routeSegment.length > 0 && (
                                            <Polyline
                                                positions={routeSegment.flatMap((seg, index) => {
                                                    const decode = polyline.decode(seg[0]).map(([lat, lng]) => ({lat,lng}))
                                                    console.log(typeof(polyline.decode(seg[0])))
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
            )
        )
        
    );
};

//Map zoom
const MapZoomCenter = ({ position }) => {
    
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 11); // Set the view to user's location with zoom level 15
        }
    }, [position, map]);

    return null;
};

//Convert city names into lat lng(location code)
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
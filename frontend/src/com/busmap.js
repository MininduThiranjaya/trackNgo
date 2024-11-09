// src/components/BusMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BusIcon from './mapIcon/busIcon';
import userIcon from './mapIcon/userIcon';

//make changes to axios
  

const BusMap = () => {

    const [buses, setBuses] = useState([]);
    const [userPosition, setUserPosition] = useState(null);

    useEffect(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { latitude, longitude } = location.coords;
                    setUserPosition([latitude, longitude]);
                },
                (error) => {
                    console.error("Error fetching user location:", error);
                }
            );
        }

        const fetchBusLocations = async () => {
            try {
                const response = await fetch('https://ba12-192-248-57-153.ngrok-free.app/api/get-bus-locations', {
                    method: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'true', // Set the header with any value
                    },
                });
                
                const data = await response.json();
                setBuses(data);
                console.log(data.busId);
            } catch (error) {
                console.error('Error fetching bus locations:', error);
            }
        };
        
        

        const intervalId = setInterval(fetchBusLocations, 5000); // Update every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Zoom user location */}
            {userPosition && <MapZoomCenter position={userPosition} />}
            {/* Render user location */}
            {userPosition && (
                <>
                    <Marker position={userPosition} icon={userIcon}>
                        <Popup>You are here</Popup>
                    </Marker>
                    <Circle
                        center={userPosition}
                        radius={500} // 500 meters radius
                        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                    />
                </>
            )}
            {buses.map((bus) => (
                <Marker key={bus.busId} position={[bus.latitude, bus.longitude]} icon={BusIcon}>
                    <Popup>
                        Bus ID: {bus.busId} <br />
                        Last Updated: {new Date(bus.lastUpdated).toLocaleString()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

const MapZoomCenter = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 15); // Set the view to user's location with zoom level 15
        }
    }, [position, map]);

    return null;
};



export default BusMap;
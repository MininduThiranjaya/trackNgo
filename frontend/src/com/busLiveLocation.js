// src/components/BusMap.js
import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import BusIcon from './mapIcon/busIcon';

export default function  BusLiveLocation({ busId }) {

    const [busDetails, setBuses] = useState();

    useEffect(() => {

        const fetchBusLocations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/get-bus-locations/${busId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                        //'ngrok-skip-browser-warning': 'true', // Set the header with any value
                    },
                });
                
                const data = await response.json();
                setBuses(data);
            } catch (error) {
                console.error('Error fetching bus locations:', error);
            }
        };
        
        

        const intervalId = setInterval(fetchBusLocations, 10000); // Update every 10 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        busDetails ?(
            busDetails.isActive ?(
                <>
                    <MapZoomCenter position={[busDetails.latitude, busDetails.longitude]}/>
                    <Marker key={busDetails.busNameId} position={[busDetails.latitude, busDetails.longitude]} icon={BusIcon}>
                        <Popup>
                            Bus ID: {busDetails.busNameId} <br />
                            Last Updated: {new Date(busDetails.lastUpdated).toLocaleString()}
                        </Popup>
                    </Marker>
                </>
            ):
            (
                <h1>The bus is not available right now...</h1>//need to add the loading effects    
            )
        ):
        (
            <h1>Loading...</h1>//need to add the loading effects
        )
    )
};

function MapZoomCenter({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 14); // Set the view to user's location with zoom level 15
        }
    }, [position, map]);

    return null;
}
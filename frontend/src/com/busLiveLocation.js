// src/components/BusMap.js
import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';


import BusIcon from './mapIcon/busIcon';

export default function  BusLiveLocation({ busId }) {

    const [busDetails, setBuses] = useState();
    const [first, setFirst] = useState({lat:0,lng:0})
    const [second, setSecond] = useState({lat:0,lng:0})
    const [speed, setSpeed] = useState(0)

    useEffect(() => {

        const fetchBusLocations = async () => {
            try {
                const response = await fetch(`https://eada-192-248-57-153.ngrok-free.app/api-user/get-bus-locations/${busId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true', // Set the header with any value
                    },
                });
                
                const data = await response.json();
                console.log(data)
                setBuses(data);
            } catch (error) {
                console.error('Error fetching bus locations:', error);
            }
        };
        
        

        const intervalId = setInterval(fetchBusLocations, 18000); // Update every 10 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [busId]);

    useEffect(() => {

        async function calculateBusSpeed(busDetails) {

            if (busDetails && first.lat == 0) {
                const setData = { nLat: busDetails.latitude, nLng: busDetails.longitude };
                setFirst( {lat:setData.nLat, lng: setData.nLng} );
            }
            else if(busDetails && second.lat == 0){
                const setData = { nLat: busDetails.latitude, nLng: busDetails.longitude };
                setSecond( {lat:setData.nLat, lng: setData.nLng} );
            }
    
            if(first.lat != 0 && second.lat != 0 && busDetails) {

                const checkData = await axios.post(`https://eada-192-248-57-153.ngrok-free.app/api-user/get-location-distance`, {
                    first,
                    second
                });
                
                const { distance, duration } = checkData.data;

                const distanceInKilometers= (distance / 1000);// Calculate the distance in km

                const timeInHours= duration / 3600;// Calculate the time in h

                const busSpeed= distanceInKilometers / timeInHours;// Calculate the speed in kmph - i think

                console.log(busSpeed)
                setSpeed(busSpeed)
            }
        }

        calculateBusSpeed(busDetails)

      }, [busDetails]);


    return (
        busDetails ?(
            busDetails ?(
                <>
                    {/* <MapZoomCenter position={[busDetails.latitude, busDetails.longitude]}/> */}
                    <Marker key={busDetails.busNumber} position={[busDetails.latitude, busDetails.longitude]} icon={BusIcon}>
                        <Popup>
                            Bus ID: {busDetails.busNumber} <br />
                            Last Updated: {new Date(busDetails.lastUpdated).toLocaleString()}<br/>
                            {
                                speed ? (<>Speed : {speed} Kmph</>) : (<>Speed : ... Kmph</>)
                            }
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
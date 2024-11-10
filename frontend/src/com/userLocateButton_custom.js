import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { createRoot } from 'react-dom/client';
import { Circle, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UserIcon from './mapIcon/userIcon';


// Main component - custom made switch for locate user current location
export default function UserLocateButoonCustom() {

    const [position, setPosition] = useState(null);
    const [makeUserVisible, setUserVisible] = useState(false)
    const defaultPosition = [7.8731, 80.7718];//Sri lanka default position
    

    useEffect(() => {
        if(makeUserVisible) {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (location) => {
                        const { latitude, longitude } = location.coords;
                        setPosition([latitude, longitude]);
                        console.log(position)
                    },
                    (error) => {
                        console.error("Error fetching location:", error);
                    }
                );
            }
        }
    }, [makeUserVisible]);

    const map = useMap();

    useEffect(() => {

        const switchControl = L.control({ position: 'topright' });

        switchControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom');

            // Prevent clicks on the form from interacting with the map
            L.DomEvent.disableClickPropagation(div);

            div.style.top = '20px';    // Adjust the top margin
            div.style.right = '50px';   // Adjust the right margin


            // Render the React Bootstrap switch buttons using JSX
            const SwitchComponent = () => (
                <Form>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label={<b>Find Me</b>}
                        style={{ transform: 'scale(1.5)', marginBottom: '5px' }} // Increase size and spacing
                        onChange={ (e) => 
                            {
                                if(e.target.checked) {
                                    setUserVisible(true);
                                }
                                else {
                                    setUserVisible(false);
                                }
                            }
                        }
                    />
                </Form>
            );

            // Render the React component into the Leaflet control container
            const root = createRoot(div); // create a root in the div
            root.render(<SwitchComponent />);

            return div;
        };

        switchControl.addTo(map);

        // Clean up control on component unmount
        return () => {
            map.removeControl(switchControl);
        };
    }, [map]);

    if(position && makeUserVisible) {
        return (
            <>
                <MapZoomCenter position={position} isActive={makeUserVisible}></MapZoomCenter>
                <Marker position={position} icon={UserIcon}></Marker>
                <Circle
                    center={position}
                    radius={1000} // 500 meters
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                />
            </>
        )
    }
    else {
        return (
            <>
                <MapZoomCenter position={defaultPosition} isActive={makeUserVisible}></MapZoomCenter>
            </>
        )
    }
};

//Map zoom
const MapZoomCenter = ({ position, isActive }) => {
    
    const map = useMap();

    useEffect(() => {
        const zoomLevel = isActive ? 15 : 8;
        const animationDuration = 2.5; // duration in seconds for the slow-motion effect

        // Use flyTo with a slow-motion effect
        map.flyTo(position, zoomLevel, {
            animate: true,
            duration: animationDuration, // control speed of the animation
            easeLinearity: 0.1 // adjust this for smoother, slower transitions (0.25 to 0.5 recommended)
        });

    }, [position, isActive, map]);

    return true;
}

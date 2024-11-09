import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import style from '../assets/leaflet_css.css'
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UserIcon from './mapIcon/userIcon';


// Custom control component to render Bootstrap switch buttons on Leaflet map
export default function UserLocateButoonCustom() {

    const [position, setPosition] = useState(null);
    const [makeUserVisible, setUserVisible] = useState(false)
    

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
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

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
                            // (e.target.checked && position ? (
                            //     <>
                            //         <Marker position={position} icon={customIcon}></Marker>
                            //         <Circle
                            //             center={position}
                            //             radius={500} // 500 meters
                            //             pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                            //         />
                            //         <zoomUseLocation position={position} />
                            //     </>
                            // ):(
                            //     null
                            // ))
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
                <Marker position={position} icon={UserIcon}></Marker>
                <Circle
                    center={position}
                    radius={1000} // 500 meters
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                />
                <MapZoomCenter position={position}></MapZoomCenter>
            </>
        )
    }
    else {
        return null;
    }
};

//search
const MapZoomCenter = ({ position }) => {
    
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 15); // Set the view to user's location with zoom level 15
        }
    }, [position, map]);

    return null;
}

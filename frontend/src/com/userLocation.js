import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set custom icon for user location marker
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LocationMap = () => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { latitude, longitude } = location.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => {
                    console.error("Error fetching location:", error);
                }
            );
        }
    }, []);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            {position ? (
                <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position} icon={customIcon}></Marker>
                    <Circle
                        center={position}
                        radius={500} // 500 meters
                        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                    />
                    <MapCenter position={position} />
                </MapContainer>
            ) : (
                <p>Loading location...</p>
            )}
        </div>
    );
};

const MapCenter = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [map, position]);
    return null;
};

export default LocationMap;

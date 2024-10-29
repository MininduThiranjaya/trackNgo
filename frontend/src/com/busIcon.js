// BusIcon.js
import L from 'leaflet';
import busIcon from '../assets/bus.png';

const BusIcon = L.icon({
    iconUrl: busIcon, // Make sure this path is correct
    iconSize: [32, 32], // Adjust as necessary
    iconAnchor: [16, 32], // Center the icon
    popupAnchor: [0, -32] // Offset for popup
});

export default BusIcon;

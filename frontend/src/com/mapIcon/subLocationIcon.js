// BusIcon.js
import L from 'leaflet';
import subLocationIcon from '../../assets/subLocation.png';

const SubLocationIcon = L.icon({
    iconUrl: subLocationIcon, // Make sure this path is correct
    iconSize: [16, 16], // Adjust as necessary
    iconAnchor: [8, 8], // Center the icon
    popupAnchor: [0, -32] // Offset for popup
});

export default SubLocationIcon;

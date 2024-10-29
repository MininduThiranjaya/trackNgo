// BusIcon.js
import L from 'leaflet';
import userIcon from '../assets/user.png';

const UserIcon = L.icon({
    iconUrl: userIcon, // Make sure this path is correct
    iconSize: [32, 32], // Adjust as necessary
    iconAnchor: [16, 32], // Center the icon
    popupAnchor: [0, -32] // Offset for popup
});

export default UserIcon;

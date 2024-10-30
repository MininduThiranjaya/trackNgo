// src/App.js
import React from 'react';
import BusMap from './com/busmap';
import MapWithGoogleGeocoding from './com/search';
import RouteMap from './com/getRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Client_Home from './pages/Client_Home';     // Adjust the path as necessary
import Client_Bus_Route_Map from './pages/Client_Bus_Route_Map';     // Adjust the path as necessary


/* The following line can be included in a src/App.scss */


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Client_Home />} />
                <Route path="/client-bus-route-map/:id" element={<Client_Bus_Route_Map />} />
            </Routes>
        </Router>
    );
}

export default App;

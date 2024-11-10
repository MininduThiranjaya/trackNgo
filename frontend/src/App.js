// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Client_Home from './pages/Client_Home';     // Client Home page
import Client_Bus_Route_Map from './pages/Client_Bus_Route_Map';     // Client map page
import Error from './pages/Error';     // Error page


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Client_Home />} />
                <Route path="/client-bus-route-map/:routeId?/:busId?" element={<Client_Bus_Route_Map />} />
                <Route path="/error" element={<Error/>} />
            </Routes>
        </Router>
    );
}

export default App;

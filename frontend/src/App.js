// src/App.js
import React from 'react';
import BusMap from './com/busmap';
import MapWithGoogleGeocoding from './com/search';
import RouteMap from './com/getRoute';

function App() {
    return (
        <div className="App">
            <h1>Bus Tracking System</h1>
            {/* <BusMap /> */}
            {/* <MapWithGoogleGeocoding/> */}
            <RouteMap routeId={`671e19f3519de50e74239b95`}/>
        </div>
    );
}

export default App;

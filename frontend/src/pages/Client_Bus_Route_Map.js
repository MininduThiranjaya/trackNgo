// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-bootstrap';

import ClientMap from '../com/clientMap'; // Client Map component
import Error from './Error'; // Error page

export default function Client_Bus_Route_Map() {
    
    const { busRouteId, busNumber } = useParams(); // extract routeId and BusId from URL

    console.log(busRouteId)
    console.log(busNumber)

    return (

        //check the route or bus id is missing or not, if not navigae to error page
        <>
            {busRouteId && busNumber ? (
                <ClientMap busRouteId={busRouteId}  busNumber={busNumber}/>
            ) : (
                <NavLink to={`/error`} activeClassName="active">
                    <Error></Error>
                </NavLink>
            )}
        </>
    );
}

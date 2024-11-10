// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-bootstrap';

import ClientMap from '../com/clientMap'; // Client Map component
import Error from './Error'; // Error page

export default function Client_Bus_Route_Map() {
    
    const { routeId, busId } = useParams(); // extract routeId and BusId from URL

    return (

        //check the route or bus id is missing or not, if not navigae to error page
        <>
            {routeId && busId ? (
                <ClientMap routeId={routeId} busId={busId}/>
            ) : (
                <NavLink to={`/error`} activeClassName="active">
                    <Error></Error>
                </NavLink>
            )}
        </>
    );
}

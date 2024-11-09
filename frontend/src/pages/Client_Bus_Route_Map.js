// src/App.js
import React from 'react';
import SearchRoute from '../com/searchRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import ClientMap from '../com/clientMap';
import Error from './Error';
import { NavLink } from 'react-bootstrap';

/* The following line can be included in a src/App.scss */


export default function Client_Bus_Route_Map() {
    const { routeId, busId} = useParams();
    console.log(typeof(routeId))
    console.log(typeof(busId))

    return (
        <>
            {routeId && busId ? (
                <ClientMap routeId={routeId} />
            ) : (
                <NavLink to={`/error`} activeClassName="active">
                    <Error></Error>
                </NavLink>
            )}
        </>
    );
}

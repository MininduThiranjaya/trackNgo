// src/App.js
import React from 'react';
import SearchRoute from '../com/routeSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import RouteMap from '../com/getRoute';

/* The following line can be included in a src/App.scss */


function Client_Bus_Route_Map() {
    const { routeId, busId} = useParams();
    console.log(routeId)
    console.log(busId)
    

    return (
        (routeId && busId ?
            (
                <>
                    <RouteMap routeId={routeId}/>
                </>
            ):(
                <>
                    <h1>Unable to load the specific location of the route(id not provided)...</h1>
                </>
            )
        )
        
    );
}

export default Client_Bus_Route_Map;

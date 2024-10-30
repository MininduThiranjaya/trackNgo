// src/App.js
import React from 'react';
import SearchRoute from '../com/routeSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import RouteMap from '../com/getRoute';

/* The following line can be included in a src/App.scss */


function Client_Bus_Route_Map() {
    const { id } = useParams();
    console.log(id)
    

    return (
        (id ?
            (
                <>
                    <RouteMap routeId={id}/>
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

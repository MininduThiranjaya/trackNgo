// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/* The following line can be included in a src/App.scss */


export default function Error() {
    return (
        <>
            <center>
                <h4 style={{ color: 'red' }}>
                        Unable to load the specific location of the route (ID not provided)...
                </h4>
            </center>
        </>
    );
}
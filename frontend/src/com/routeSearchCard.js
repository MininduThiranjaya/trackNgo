import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useEffect, useReducer, useState } from 'react';
import BusCard from './busCard';
import axios from 'axios';


function HeaderAndFooterExample() {

    const [selectedCities, setCities] = useState([]);
    const [status, setStatus] = useState();
    let [sourceLocation, setStart] = useState();
    let [destinationLocation, setEnd] = useState();
    const [busRoute, setBusRouteWithBus] = useState();

    const cities = [
        "Colombo",
        "Kandy",
        "Galle",
        "Jaffna",
        "Negombo",
        "Matara",
        "Nuwara Eliya",
        "Batticaloa",
        "Anuradhapura",
        "Polonnaruwa",
        "Trincomalee",
        "Dambulla",
        "Ratnapura",
        "Kalutara",
        "Mannar",
        "Vavuniya",
        "Hambantota",
        "Puttalam",
        "Kegalle",
        "Kurunegala",
        "Gampaha",
        "Maharagama",
        "Wattala",
        "Dehiwala-Mount Lavinia",
        "Nugegoda",
        "Moratuwa",
        "Avissawella",
        "Ja-Ela",
        "Biyagama",
        "Bandarawela",
        "Badulla",
        "Thomian",
        "Akurana",
        "Kilinochchi",
        "Tissamaharama",
        "Mullaitivu",
        "Panchikawatte",
        "Diyathalawa",
        "Sevanapitiya"
    ];
    
    function findCity(cityName, status) {

        setStatus(status);

        const selected = cities.filter((city) => (
            city.toLocaleLowerCase().includes(cityName.toLocaleLowerCase())
        ))

        setCities(selected);
        console.log(selectedCities);
    }

    {
        console.log(sourceLocation)
        console.log(destinationLocation)
    }

    async function busRouteWithBus () {

        sourceLocation = sourceLocation.toLocaleLowerCase();
        destinationLocation = destinationLocation.toLocaleLowerCase();

        try {
            // Fetch route data from backend
            const response = await axios.post('http://localhost:8080/api/search_for_buses', {
                sourceLocation,
                destinationLocation
            });
            
            //const response = await fetch(`http://localhost:8080/api/get-route/${routeId}`);
            const {route} = response.data;

            // Gather all cities
            setBusRouteWithBus(route);
            console.log(route)
            
            }
        catch (error) {
            console.error('Error fetching route or coordinates:', error);
        }
    };

    return (
        <>    
            <Row>
                <Card className="text-center">
                    <Card.Header></Card.Header>
                    <Card.Body>
                    <Card.Title>Bus Routes</Card.Title>
                    <Card.Text>
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Control text={sourceLocation} onChange={(e) => findCity(e.target.value, 'start') } type="text" placeholder="Starts Location" />
                                    <ul>
                                        {
                                            selectedCities.map((city, index) => {
                
                                                if(status === 'start') {
                                                    return (
                                                    <li key={index} onClick={() => {
                                                        setStart(city)
                                                    }}>{city}</li>
                                                    )
                                                }
                                            })
                                        }
                                    </ul>
                                </Col>
                                <Col>
                                    <Form.Control text={destinationLocation} onChange={(e) => findCity(e.target.value, 'end')} type="text" placeholder="Ends Location" />
                                    <ul>
                                    {
                                            selectedCities.map((city, index) => {
                
                                                if(status === 'end') {
                                                    return (
                                                    <li key={index} onClick={() => {
                                                        setEnd(city)
                                                    }}>{city}</li>
                                                    )
                                                }
                                            })
                                        }
                                    </ul>
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                <div style={{ justifyContent: 'center' }}>
                                    <Button variant="primary" onClick={() => busRouteWithBus()}>Search</Button>
                                </div>
                            </Row>
                        </Container>
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">Search for more results</Card.Footer>
                </Card>
            </Row>
            {/* <Row>
                <BusCard busRouteWithBus={busRoute}/>
            </Row> */}
        </>
    );
}

export default HeaderAndFooterExample;
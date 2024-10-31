import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useEffect, useReducer, useState } from 'react';
import BusCard from './busCard';
import axios from 'axios';


function HeaderAndFooterExample() {

    const [selectedCities, setCities] = useState([]);
    const [inputValueSource, setInputValueSource] = useState('');
    const [inputValueDestination, setInputValueDestination] = useState('');
    const [searchStatus, setStatus] = useState();
    const [isSelectedCity, setIsSelectedCity] = useState(false);
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
    
    function findCity(e,status) {
        
        setStatus(status);
        setIsSelectedCity(false)

        if(status === 'start') {
            setInputValueSource(e.target.value);
            console.log(e.target.value)
            if (inputValueSource) {
                const selected = cities.filter((city) => (
                    city.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                ))
                setCities(selected);
            }
            else {
                setBusRouteWithBus('');
                setCities([]);
            }
        }
        else {
            setInputValueDestination(e.target.value);
            console.log(e.target.value)
            if (inputValueDestination) {
                const selected = cities.filter((city) => (
                    city.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                ))
                setCities(selected);
            }
            else {
                setBusRouteWithBus('');
                setCities([]);
            }
        }
    }

    function handleSelectedCity(city_onClick, status) {

        if(status === 'start') {
        
            setInputValueSource(city_onClick)
            setStart(city_onClick)
            setIsSelectedCity(true)
            setCities([]);
        }
        else {
            setInputValueDestination(city_onClick)
            setEnd(city_onClick)
            setIsSelectedCity(true)
            setCities([]);
        }
    }

    async function busRouteWithBus () {

        if(!sourceLocation) {
            setStart(inputValueSource)
        }
        else{
            sourceLocation = sourceLocation.toLowerCase();
        }
        
        if(!destinationLocation){
            setEnd(inputValueDestination);
        }
        else {
            destinationLocation = destinationLocation.toLowerCase();
        }

        try {
            // Fetch route data from backend
            const response = await axios.post('http://localhost:8080/api/search_for_buses', {
                sourceLocation,
                destinationLocation
            });
            
            //const response = await fetch(`http://localhost:8080/api/get-route/${routeId}`);
            const {busRouteWithBus} = response.data;

            // Gather all cities
            setBusRouteWithBus(busRouteWithBus);
            console.log(busRouteWithBus)
            
            }
        catch (error) {
            console.error('Error fetching route or coordinates:', error);
        }
    };

    return (
        <>    
            <Row className="mb-4">
                <Card className="text-center">
                    <Card.Header></Card.Header>
                    <Card.Body>
                    <Card.Title></Card.Title>
                    <Card.Text>
                        <Container>
                            <Row>
                                <Col xs={12} md={6} className="mb-3">
                                    <Form.Control text='text' style={{ fontWeight: 'bold'}} value={inputValueSource} onChange={(e) => findCity(e, 'start') } type="text" placeholder="Starts Location" />

                                    <div class="overflow-auto" style={{height:"100px"}} >
                                        {
                                            selectedCities.map((city, index) => {
                
                                                if(searchStatus === 'start') {
                                                    return (
                                                        <div>
                                                            <hr></hr>
                                                            <div key={index} onClick={() => {
                                                                handleSelectedCity(city,'start')
                                                            }}>{city}</div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </Col>
                                <Col>
                                    <Form.Control text='text' style={{ fontWeight: 'bold' }} value={inputValueDestination} onChange={(e) => findCity(e, 'end')} type="text" placeholder="Ends Location" />
                                    
                                    <div class="overflow-auto" style={{height:"100px"}}>
                                    {
                                            selectedCities.map((city, index) => {
                
                                                if(searchStatus === 'end') {
                                                    return (
                                                   <>
                                                        <hr></hr>
                                                        <div key={index} onClick={() => {
                                                                handleSelectedCity(city,'end')
                                                        }}>{city}</div>
                                                   </> 
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                <br></br>
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

            {
                (busRoute?(
                    <Row>
                        <BusCard busRouteWithBus={busRoute}/>
                    </Row> 
                ):(<Row>
                    <center>
                        <br></br>
                        <p>No Search Services</p>
                    </center>
                </Row>))
            }

           
        </>
    );
}

export default HeaderAndFooterExample;
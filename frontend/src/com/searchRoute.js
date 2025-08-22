import { Container, Row, Col } from 'react-bootstrap';
import RouteDetailsCard from './routeDetailsCard';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import axios from 'axios';

// Main component
export default function SearchRouteCard() {

    //To filter start and end location from input box
    const [searchStatus, setStatus] = useState();

    //All bus route that matches user input
    const [busRoute, setBusRouteWithBus] = useState(0);

    //User selected city from drop down menu
    const [selectedCities, setCities] = useState([]);
    
    //User input city - onchange
    const [inputValueSource, setInputValueSource] = useState('');
    const [inputValueDestination, setInputValueDestination] = useState('');
    
    //Source and Destination location can be changed
    let [startLocation, setStart] = useState();
    let [endLocation, setEnd] = useState();

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
    

    //Input city name - onchange
    function findCity(e,status) {
        
        setStatus(status);

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
                // setBusRouteWithBus('');
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
                // setBusRouteWithBus('');
                setCities([]);
            }
        }
    }

    //Selected city from drop down menu
    function handleSelectedCity(city_onClick, status) {

        if(status === 'start') {
        
            setInputValueSource(city_onClick)
            setStart(city_onClick)
            setCities([]);
        }
        else {
            setInputValueDestination(city_onClick)
            setEnd(city_onClick)
            setCities([]);
        }
    }

    //Fetching selected bus route from backend - find results
    async function busRouteWithBus () {

        if(!startLocation) {
            setStart(inputValueSource)
        }
        else{
            startLocation = startLocation.toLowerCase();
        }
        
        if(!endLocation){
            setEnd(inputValueDestination);
        }
        else {
            endLocation = endLocation.toLowerCase();
        }

        try {
            // Fetch route data from backend
            const response = await axios.post('http://localhost:8080/api-user/search-for-buses', {
                startLocation,
                endLocation
            });
            
            const {busRouteWithBus} = response.data;

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
            
            
            {/* If there are any bus routes available, then show */}
            {
                (busRoute.length > 0 ? (
                    <Row>
                        <RouteDetailsCard busRouteWithBus={busRoute}/>
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
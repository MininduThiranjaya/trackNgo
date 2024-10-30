import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';


function BusCard({busRouteWithBus}) {
  
  return (
    <Container className="my-3 p-4">
      <Row xs={1} md={3} className='g-4 '>
        {
          busRouteWithBus.map((e, index) => {
            return (
              <Col key={index}>
                <Card className="px-4" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Route</Card.Title>
                  <Card.Text>
                    <p>
                      <b>Starts : </b>{e.source}
                    </p>
                    <b>Stops : </b> 
                    <ul>
                        {
                          e.stops.map((stop, index) => {
                            return (
                              <li key={index}>{stop}</li>
                            )
                          })
                        }
                    </ul>
                    <b>Destination : </b>{e.destination}
                    
                    <p>
                      <b>Buses :</b> 
                    </p>
                        {
                          ((e.busName.length > 1)?
                          (
                            e.busName.map((e, index) => {
                              return (
                                <Container>
                                  <Row>
                                    <Col>{e}</Col>
                                    <Col>Location</Col>
                                    <Col>Status</Col>
                                  </Row>
                                </Container>
                              )
                            })
                          ):(
                            <Container>
                              <Row>
                                <Col>{e.busName}</Col>
                                <Col>Location</Col>
                                <Col>Status</Col>
                              </Row>
                            </Container>
                          ))
                        }

                  </Card.Text>
                  <NavLink to={`/client-bus-route-map/${e._id}`} activeClassName="active">
                    <FontAwesomeIcon icon={faLocationCrosshairs} size="lg"  className='px-1' style={{color: "#3512e2"}} />
                    Find Me
                  </NavLink>

                </Card>
              </Col>
            )
          })
        }
      </Row>
    </Container>
  );
}

export default BusCard;
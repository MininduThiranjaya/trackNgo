import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';

// Main component
export default function RouteDetailsCard({busRouteWithBus}) {
  
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
                    <Container>
                      <Row className='g-2'>
                        {
                          ((e.busInfo.length > 0)?
                          (
                            e.busInfo.map((bus, index) => {
                              return (
                                <>
                                <hr></hr>
                                  <Col xs={12} md={2}>{bus.busNameId}</Col>
                                  <Col xs={12} md={3}>Location</Col>
                                  <Col xs={12} md={4}>
                                  {
                                    console.log()
                                  }
                                  {
                                    (bus.isActive ?
                                      ( 
                                        <>
                                          Available <FontAwesomeIcon icon={faCircleDot} size="lg"  className='px-1' style={{color: "#63E6BE"}}/>
                                        </>
                                      ):(
                                        <>
                                          Not Available <FontAwesomeIcon icon={faCircleDot} size="lg"  className='px-1' style={{color: "#de2f1b"}}/>
                                        </>
                                      )
                                    )
                                  }
                                    
                                  </Col>
                                  <Col xs={12} md={3}>
                                  <NavLink to={`/client-bus-route-map/${e._id}/${bus.busNameId}`} activeClassName="active">
                                    <FontAwesomeIcon icon={faLocationCrosshairs} size="lg"  className='px-1' style={{color: "#3512e2"}} />
                                    Find Me
                                  </NavLink>
                                  </Col>
                                  <hr></hr>
                                </>
                              )
                            })
                          ):(
                            <>
                              <hr></hr>
                                <Col xs={12} md={3}><p>No buses have assign for this route path</p></Col>
                              <hr></hr>
                            </>  
                          ))
                        }
                      </Row>
                    </Container>
                  </Card.Text>
                </Card>
              </Col>
            )
          })
        }
      </Row>
    </Container>
  );
}
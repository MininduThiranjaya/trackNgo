import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';


function BusCard({busRouteWithBus}) {
  
  return (
    <Container className="my-3 p-4">
      <Row xs={1} md={3} className='g-4 '>
        {
          busRouteWithBus.map((e, index) => {
            return (
              <Col key={index}>
                <Card className="px-4" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Card with Equal Left and Right Padding</Card.Title>
                  <Card.Text>
                    This card has equal padding on the left and right sides.
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

export default BusCard;
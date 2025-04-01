import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Quadrant: React.FC = () => {
  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Welcome to Quadrant Page</h1>
      <Row className="mb-4">
        <Col md={6}>
        <Card className="mb-4">
            <Card.Img variant="top" src="https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Basic Math"    style={{ width: '700px', height: '300px', objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title>
                <Card.Link href="/GroupingSub" className="stretched-link" >
                Basic Calculations
                </Card.Link>
                </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Img variant="top" src="https://plus.unsplash.com/premium_photo-1724266846405-12252cf1233d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Intermediate Calculations" style={{ width: '700px', height: '300px', objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title><Card.Link href="/GroupingSub" className="stretched-link" >
                Intermidiate Calculations
                </Card.Link></Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src="https://plus.unsplash.com/premium_photo-1683121152928-787ececd7359?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Advanced Calculations" style={{ width: '700px', height: '300px', objectFit: 'cover' }} />
            <Card.Body>
            <Card.Body>
              <Card.Title><Card.Link href="/GroupingSub" className="stretched-link" >
                Advanced Calculations
                </Card.Link></Card.Title>
            </Card.Body>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Quadrant;

import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Grouping = () => {
  return (
    <div>
      <h1>Welcome to Grouping</h1>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src="https://plus.unsplash.com/premium_photo-1724266846299-2c4e63cdccd3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="With Regrouping"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>
                 <Card.Link href="/NumberofDigitsSub" className="stretched-link" >
                                With Regrouping
                                </Card.Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src="https://images.unsplash.com/photo-1601397922721-4326ae07bbc5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Without Regrouping"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>
              <Card.Link href="/NumberofDigitsSub" className="stretched-link" >
              Without Regrouping
                                </Card.Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Grouping;

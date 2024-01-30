import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, ListGroupItem, Button, Modal, Form, Navbar, Nav } from 'react-bootstrap';

const PersonList = ({ people }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const createNewPerson = async (newName) => {
    if (newName) {
      const formData = new FormData();
      formData.append('name', newName);

      try {
        await axios.post('http://localhost:8080/person', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        handleClose();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const removePerson = async (personID) => {
    // Implement the logic to remove the person with the given name.
    console.log(`Removing person with ID: ${personID}`);
    try {
      // Use axios.delete with a URL that includes the orderId as a path variable
      const response = await axios.delete(`http://localhost:8080/person/removePerson/${personID}`);
      console.log('Order removal successful:', response.data);
    } catch (error) {
      console.error('Order removal unsuccessful:', error);
    }
  };

  return (
    <div>

      {/* Content */}
      <div className="container mt-5">
        <Card style={{ cursor: 'pointer' }} onClick={handleShow}>
          <Card.Body>
            <Card.Title>Add New Person</Card.Title>
            <Card.Text>Click here to add a new person.</Card.Text>
          </Card.Body>
        </Card>

        {people &&
          people.map((document) => (
            <Card
      key={document.id}
      style={{ cursor: 'pointer' }}
      onClick={() => console.log(`Clicked on person: ${document.name}`)}
    >
      <Card.Body style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Card.Title>{document.name}</Card.Title>
        <Button
          variant="danger"
          style={{ backgroundColor: 'white', color: 'red', border: 'none' }}
          onClick={() => removePerson(document.id)}
        >
          &#10006; {/* Unicode for cross sign */}
        </Button>
      </Card.Body>
    </Card>
          ))}

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Person</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Enter the name of the new person:</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => createNewPerson(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PersonList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, ListGroupItem, Button, Modal, Form, Navbar, Nav } from 'react-bootstrap';

const PersonList = ({ people, archivedPeople, updatePeople }) => {
  const [showModal, setShowModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [showArchivedList, setShowArchivedList] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const toggleArchivedList = () => setShowArchivedList(!showArchivedList);

  const handlePersonClick = (personId) => {
    setEditingPersonId(personId);
  };

  const handleNameChange = async (event, personId) => {
    const newName = event.target.value;
    if (event.key === 'Enter') {
      try {
        const formData = new FormData();
        formData.append('name', newName);
        // Make API call to update the name
        console.log(`Updating name of person with ID ${personId} to ${newName}`);
        await axios.post(`http://localhost:8080/person/${personId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Update the people list after successful rename
        updatePeople();
        setEditingPersonId(null);
      } catch (error) {
        console.error('Error updating name:', error);
        // Handle error scenario if needed
      }
    }
  };
  
  const toCamelCase = (name) => {
    return name.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

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
        updatePeople();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSubmit = () => {
    createNewPerson(newPersonName);
    handleClose();
  };

  const removePerson = async (personID) => {
    console.log(`Removing person with ID: ${personID}`);
    try {
      const response = await axios.delete(`http://localhost:8080/person/removePerson/${personID}`);
      console.log('Person removal successful:', response.data);
      updatePeople();
    } catch (error) {
      console.error('Person removal unsuccessful:', error);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <Card style={{ cursor: 'pointer' }} onClick={handleShow}>
          <Card.Body style={{ backgroundColor: '#e7f0f7' }}>
            <Card.Title style={{ fontWeight: 'bold' }}>Add New Person</Card.Title>
          </Card.Body>
        </Card>

        {people &&
          people.map((document) => (
            <Card key={document.id} style={{ cursor: 'pointer' }}>
              <Card.Body
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {editingPersonId === document.id ? (
                  <Form.Control
                  type="text"
                  defaultValue={toCamelCase(document.name)}
                  onChange={(event) => handleNameChange(event, document.id)}
                  onKeyPress={(event) => handleNameChange(event, document.id)}
                />
                
                ) : (
                  <Card.Title onClick={() => handlePersonClick(document.id)}>
                    {toCamelCase(document.name)}
                  </Card.Title>
                )}
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
      </div>

      <div className="container mt-5">
        <Card style={{ cursor: 'pointer' }} onClick={toggleArchivedList}>
          <Card.Body style={{ backgroundColor: '#e7f0f7' }}>
            <Card.Title style={{ fontWeight: 'bold' }}>Archive</Card.Title>
          </Card.Body>
        </Card>
        {!showArchivedList ? (
          ""
        ) : (
          archivedPeople.map((document) => (
            <Card key={document.id} style={{ cursor: 'pointer' }}>
              <Card.Body
                style={{ backgroundColor: '#e7f0f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Card.Title style={{ fontWeight: 'bold' }}>{toCamelCase(document.name)}</Card.Title>
                <Button
                  variant="danger"
                  style={{ backgroundColor: 'white', color: 'black', border: 'none'}}
                  onClick={() => removePerson(document.id)}
                >
                   &#9100; {/* Unicode for cross sign */}
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Enter the name of the new person:</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewPersonName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonList;

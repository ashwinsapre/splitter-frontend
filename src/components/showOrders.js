import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Navbar, Nav } from 'react-bootstrap';

const handleFileClick = (file) => {
  console.log(`Clicked on file: ${file}`);
  window.location.href = `/orders/${file}`;
};

const FileList = ({ directory, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [orderIdToRemove, setOrderIdToRemove] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setConfirmModal(false);
  };

  const handleShow = () => setShowModal(true);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/orders`);
      setFiles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (uploadedFile) => {
    onUpload(uploadedFile);
    handleClose();
  };

  const handleRemoveOrder = (orderId) => {
    setOrderIdToRemove(orderId);
    setConfirmModal(true);
  };

  const confirmRemoveOrder = async () => {
    console.log('Removing order with ID:', orderIdToRemove);
  
    try {
    
      const response = await axios.delete(`http://localhost:8080/orders/removeOrder/${orderIdToRemove}`);
      console.log('Order removal successful:', response.data);
  
      // Update the state to remove the deleted order from the list
      setFiles((prevFiles) => prevFiles.filter((document) => document.orderId !== orderIdToRemove));
    } catch (error) {
      console.error('Order removal unsuccessful:', error);
    }
  
    // After successful removal or not, close the confirm modal
    setConfirmModal(false);
  };

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="w-100">
        <Navbar.Brand href="/home">Walmart Splitter</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="mr-auto">
            <Nav.Link href="/person">People</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            {/* Add more links as needed */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Content */}
      <div className="container mt-5">
        <Card style={{ cursor: 'pointer' }} onClick={handleShow}>
          <Card.Body>
            <Card.Title>Add New Order</Card.Title>
            <Card.Text>Upload saved HTML from your Walmart Order Invoice</Card.Text>
          </Card.Body>
        </Card>

        {files.map((document) => (
          <Card
            key={document.orderId}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Card.Title onClick={() => handleFileClick(document.orderId)}>ID: {document.orderId}</Card.Title>
                <Card.Text onClick={() => handleFileClick(document.orderId)}>Date: {document.date}</Card.Text>
              </div>
              <Button
                variant="danger"
                style={{
                  backgroundColor: 'white',
                  color: 'red',
                  border: 'none',
                }}
                onClick={() => handleRemoveOrder(document.orderId)}
                className="ml-2"
              >
                &#10006; {/* Unicode for cross sign */}
              </Button>
            </Card.Body>
          </Card>
        ))}

        {/* Upload Modal */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Upload New Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Select a file to upload:</Form.Label>
                <Form.Control type="file" onChange={(e) => handleUpload(e.target.files[0])} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleUpload(null)}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirm Remove Order Modal */}
        <Modal show={confirmModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Removal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove this order?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemoveOrder}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default FileList;

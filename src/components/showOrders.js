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

  const handleClose = () => setShowModal(false);
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
            <Card.Text>Click here to upload a new order.</Card.Text>
          </Card.Body>
        </Card>

        {files.map((document) => (
          <Card
            key={document.orderId}
            style={{ cursor: 'pointer' }}
            onClick={() => handleFileClick(document.orderId)}
          >
            <Card.Body>
              <Card.Title>ID: {document.orderId}</Card.Title>
              <Card.Text>Date: {document.date}</Card.Text>
            </Card.Body>
          </Card>
        ))}

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
      </div>
    </div>
  );
};

export default FileList;

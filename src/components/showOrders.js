import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Navbar, Nav } from 'react-bootstrap';

const handleFileClick = (file) => {
  console.log(`Clicked on file: ${file}`);
  window.location.href = `/orders/${file}`;
};

const FileList = ({ directory, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [orderIdToRemove, setOrderIdToRemove] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setConfirmModal(false);
  };

  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/orders`);
        const allOrders = response.data;
        setFiles(allOrders);
        setActiveOrders(allOrders.filter(order => !order.archived));
        setArchivedOrders(allOrders.filter(order => order.archived));
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

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
    console.log('Archiving order with ID:', orderIdToRemove);
  
    try {
      const response = await axios.delete(`http://localhost:8080/orders/removeOrder/${orderIdToRemove}`);
      console.log('Order (un)archival successful:', response.data);
  
      // Update the state to remove the deleted order from the list
      const fetchFiles = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/orders`);
          const allOrders = response.data;
          setFiles(allOrders);
          setActiveOrders(allOrders.filter(order => !order.archived));
          setArchivedOrders(allOrders.filter(order => order.archived));
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      };
  
      fetchFiles();
    } catch (error) {
      console.error('Order (un)archival unsuccessful:', error);
    }
  
    // After successful removal or not, close the confirm modal
    setConfirmModal(false);
  };

  return (
    <div className="container-fluid">

      {/* Content */}
      <div className="container mt-5">
        <Card style={{  backgroundColor: '#e7f0f7', cursor: 'pointer' }} onClick={handleShow}>
          <Card.Body>
            <Card.Title>Add New Order</Card.Title>  
          </Card.Body>
        </Card>

        {activeOrders.map((document) => (
          <Card
            key={document.orderId}
          >
            <Card.Body style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Card.Title  style={{ cursor: 'pointer' }} onClick={() => handleFileClick(document.orderId)}>{new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(document.date))}</Card.Title>
                <Card.Text onClick={() => handleFileClick(document.orderId)}>{document.orderId}</Card.Text>
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
                &#10006; {/* Unicode for undo sign */}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    <div className="container mt-5">
      {archivedOrders.map((document) => (
          <Card
            key={document.orderId}
          >
            <Card.Body style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Card.Title  style={{ cursor: 'pointer' }} onClick={() => handleFileClick(document.orderId)}> {new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(document.date))} (archived)</Card.Title>
                <Card.Text onClick={() => handleFileClick(document.orderId)}>{document.orderId}</Card.Text>
              </div>
              <Button
                variant="danger"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                }}
                onClick={() => handleRemoveOrder(document.orderId)}
                className="ml-2"
              >
                &#9100; {/* Unicode for cross sign */}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

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
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure? 
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemoveOrder}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  
  );
};

export default FileList;

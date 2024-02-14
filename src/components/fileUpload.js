import React, { useState } from 'react';
import axios from 'axios';
import FileList from './showOrders';
import OrderDetails from './showOrder';
import { Card, Button, Modal, Form, Navbar, Nav } from 'react-bootstrap';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [key, setKey] = useState(0);

  // Function to handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Function to handle file upload
  const handleUpload = async (uploadedFile) => {
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploaded(true);
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <Navbar expand="lg" className="w-100" style={{backgroundColor: '#0071ce'}}>
      <Navbar.Brand href="/home" style={{ fontWeight: 'bold' }}>
        <span style={{ color: 'white' }}>Walmart</span>{' '}
        <span style={{ color: '#ffc120' }}>Splitter</span>
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="mr-auto">
            <Nav.Link href="/person" style={{ fontWeight: 'bold', color: 'white' }}>People</Nav.Link>
            <Nav.Link href="#" style={{ fontWeight: 'bold', color: 'white' }}>About</Nav.Link>
            {/* Add more links as needed */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    <div style={{ display: 'flex' }}>
      {/* Display the FileList component with the key */}
      <div style={{ flex: 1 }}>
        <FileList key={key} directory="uploaded-directory" onUpload={handleUpload} />
      </div>
      <div style={{ flex: 4 }}>
        <OrderDetails />
      </div>
    </div>
  </div>
  );
};

export default FileUpload;

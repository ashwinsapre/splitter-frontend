import React, { useState } from 'react';
import axios from 'axios';
import FileList from './showOrders';
import OrderDetails from './showOrder';

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
    <div>
      {/* Display the FileList component with the key */}
      <FileList key={key} directory="uploaded-directory" onUpload={handleUpload} />
      <OrderDetails />
    </div>
  );
};

export default FileUpload;
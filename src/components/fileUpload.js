import React, { useState } from 'react';
import axios from 'axios';
import FileList from './showOrders';
import OrderDetails from './showOrder';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [key, setKey] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

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
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {<FileList key={key} directory="uploaded-directory" />}
      <OrderDetails />
    </div>
  );
};

export default FileUpload;

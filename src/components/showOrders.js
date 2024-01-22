import React, { useState, useEffect } from 'react';
import axios from 'axios';

const handleFileClick = (file) => {
    console.log(`Clicked on file: ${file}`);
    window.location.href = `/orders/${file}`;
  };

const FileList = ({ directory }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/orders`);
        setFiles(response.data)
        console.log(response.data)

      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Files in {directory}:</h2>
      <ul>
      {files.map((document) => (
        <div key={document.orderId} onClick={() => handleFileClick(document.orderId)}>
          <p>ID: {document.orderId}</p> <p>Date: {document.date}</p>
        </div>
      ))}

      </ul>
    </div>
  );
};

export default FileList;

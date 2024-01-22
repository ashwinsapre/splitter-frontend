import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonDetails = () => {
  const [personID, setPersonID] = useState(0);
  const [personName, setPersonName] = useState("");

  useEffect(() => {
    const currentURL = window.location.href;
    const personId = currentURL.split("/person/")[1];
    console.log("personID is", personId);
    setPersonID(personId);
    if (personID !== undefined || personID !== " "){
      axios.get(`http://localhost:8080/person/${personId}`)
      .then(response => {
        console.log('Received person details:', response.data);
        setPersonID(response.data.id);
        setPersonName(response.data.name);
      })
      .catch(error => console.error('Error fetching person details:', error));
    }
  }, []);

  if (personID === 0 || personName==="") {
    return <div></div>;
  }

  return (
    <div>
      <h1>Person Details</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{personID}</td>
            <td>{personName}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PersonDetails;

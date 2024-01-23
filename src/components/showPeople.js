import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonDetails from './showPerson';
import Groups from './showGroups';

const PersonList = () => {
  const [people, setPeople] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/person`);
        setPeople(response.data);
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };

    fetchPeople();
  }, []);

  const createNewPerson = async () => {
    const newName = window.prompt('Enter the name of the new person:');
    
    if (newName) {
      const formData = new FormData();
      formData.append('name', newName);

      try {
        await axios.post('http://localhost:8080/person', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/home">Walmart Splitter</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/orders">Orders</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/person">About</a>
              </li>
              {/* Add more links as needed */}
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mt-5">
        <h2>People:</h2>
        <ul className="list-group">
          {people &&
            people.map((document) => (
              <li key={document.name} className="list-group-item">
                <p className="mb-0">Name: {document.name}</p>
              </li>
            ))}
        </ul>
        <button className="btn btn-primary mt-3" onClick={createNewPerson}>
          Add Person
        </button>
        <div className="mt-4">
          <PersonDetails />
          <Groups people={people} />
        </div>
      </div>
    </div>
  );
};

export default PersonList;

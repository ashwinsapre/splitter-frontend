import React, { useState, useEffect } from 'react';
import PersonList from './showPeople'; // Assuming this is the file containing the People component
import Groups from './showGroups'; // Assuming this is the file containing the Groups component
import PersonDetails from './showPerson';
import axios from 'axios';
import { Navbar, Nav } from 'react-bootstrap';

const PeopleAndGroups = () => {
  const [people, setPeople] = useState(null);
  const [archivedPeople, setArchivedPeople] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/person`);
        setPeople(response.data.filter(person => !person.archived));
        setArchivedPeople(response.data.filter(person => person.archived));
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };

    fetchPeople();
  }, []);

  
  const updatePeople = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/person`);
      setPeople(response.data.filter(person => !person.archived));
      setArchivedPeople(response.data.filter(person => person.archived));
      console.log('People updated:', response.data);
    } catch (error) {
      console.error('Error updating people:', error);
    }
  };

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <Navbar expand="lg" className="w-100"  style={{backgroundColor: '#0071ce'}}>
      <Navbar.Brand href="/home" style={{ fontWeight: 'bold' }}>
        <span style={{ color: 'white' }}>Walmart</span>{' '}
        <span style={{ color: '#ffc120' }}>Splitter</span>
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="mr-auto">
            <Nav.Link href="/orders" style={{ fontWeight: 'bold', color: 'white' }}>Orders</Nav.Link>
            <Nav.Link href="#" style={{ fontWeight: 'bold', color: 'white' }}>About</Nav.Link>
            {/* Add more links as needed */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      
      <div className="row">
        <div className="col-md-6">
          {/* People Component */}
          <PersonList people={people} archivedPeople={archivedPeople} updatePeople={updatePeople} />
        </div>
        <div className="col-md-6">
          {/* Groups Component */}
          <Groups people={people} archivedPeople={archivedPeople}/>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-md-12">
          {/* PersonDetails Component */}
          <PersonDetails people={people}/>
        </div>
      </div>
    </div>
  );
};

export default PeopleAndGroups;

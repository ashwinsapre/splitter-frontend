import React, { useState, useEffect } from 'react';
import PersonList from './showPeople'; // Assuming this is the file containing the People component
import Groups from './showGroups'; // Assuming this is the file containing the Groups component
import axios from 'axios';
import { Navbar, Nav } from 'react-bootstrap';

const PeopleAndGroups = () => {
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

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Navbar */}
      <Navbar bg="light" expand="lg" className="w-100">
        <Navbar.Brand href="/home">Walmart Splitter</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="mr-auto">
            <Nav.Link href="/orders">Orders</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            {/* Add more links as needed */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
        <div className="col-md-6">
          {/* People Component */}
          <PersonList people={people} />
        </div>
        <div className="col-md-6">
          {/* Groups Component */}
          <Groups people={people}/>
        </div>
      </div>
    </div>
  );
};

export default PeopleAndGroups;

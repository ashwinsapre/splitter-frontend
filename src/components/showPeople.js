import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonDetails from './showPerson';
import Groups from './showGroups';

const PersonList = () => {
  const [people, setPeople] = useState(null);
  // const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/person`);
        console.log(response.data);
        setPeople(response.data);
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };

    fetchPeople();
  }, []);

  const createNewPerson = async () => {
    // Use window.prompt to get the name from the user
    const newName = window.prompt('Enter the name of the new person:');
    
    if (newName) {
      const formData = new FormData();
      formData.append('name', newName);
      try{
        axios.post('http://localhost:8080/person', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },});
      }
      catch(error){
        console.error('Error uploading file:', error);
      }
      
    }
  };

  return (
    <div>
      <h2>People:</h2>
      <ul>
        {people &&
          people.map((document) => (
            <div key={document.name}>
              <p>Name: {document.name}</p>
            </div>
          ))}
      </ul>
      <button onClick={createNewPerson}>Add Person</button>
      <PersonDetails></PersonDetails>
      <Groups people={people}></Groups>
    </div>
  );
};

export default PersonList;

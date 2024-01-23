import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import { Button, Form, InputGroup, FormControl } from 'react-bootstrap';

const Groups = ({ people }) => {
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState(null);
  const [groupPersonMap, setGroupPersonMap] = useState({});
  const [inputValues, setInputValues] = useState({});

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/groups`);
      setGroups(response.data);

      // Initialize inputValues for each group
      const initialInputValues = {};
      response.data.forEach((group) => {
        initialInputValues[group.id] = '';
      });
      setInputValues(initialInputValues);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/groups/get`);
        
        setGroupMembers(response.data);

        const initialMap = {};
        response.data.forEach((member) => {
          if (!initialMap[member.groupId]) {
            initialMap[member.groupId] = [];
          }
          initialMap[member.groupId].push(people.find((person) => person.id === member.personId).name);
        });
        groups.forEach((group) =>{
        if (!initialMap[group.id]){
          initialMap[group.id] = [];
        }
        });
        setGroupPersonMap(initialMap);
      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    };
    fetchGroupMembers();
    }, [groups, people]); // Include people as a dependency to ensure the correct person data is used

  const handleRemovePersonFromGroup = (groupID, personName) => {
    const updatedGroupPersonMap = { ...groupPersonMap };

    updatedGroupPersonMap[groupID] = updatedGroupPersonMap[groupID].filter(
      (name) => name !== personName
    );

    setGroupPersonMap(updatedGroupPersonMap);
  };

  const handleInputChange = (groupID, event) => {
    const value = event.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [groupID]: value,
    }));

    const person = people.find((person) => person.name.toLowerCase() === value.toLowerCase());
    if (person && !groupPersonMap[groupID]?.includes(person.name)) {
      setGroupPersonMap((prevMap) => ({
        ...prevMap,
        [groupID]: [...(prevMap[groupID] || []), person.name],
      }));
      setInputValues((prevValues) => ({
        ...prevValues,
        [groupID]: '',
      }));
    }
  };

  const handleSave = async () => {
    const payload = {
      groups: Object.entries(groupPersonMap).map(([groupId, members]) => ({
        groupId,
        personIds: members.map((memberName) =>
          people.find((person) => person.name === memberName)?.id
        ),
      })),
    };

    try {
      const response = await axios.post('http://localhost:8080/groups/saveGroup', payload);
      console.log('Group members saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving group members:', error);
    }
  };

  const handleCreateGroup = async () => {
    const groupName = prompt('Enter group name:');
    if (groupName) {
      const formData = new FormData();
      formData.append('name', groupName);
      try {
        await axios.post('http://localhost:8080/groups', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error('Error uploading group:', error);
      }
    }
    fetchGroups();
  };

  return (
    <div className="container mt-5">
      <h2>Groups</h2>
      <Button variant="primary" onClick={handleCreateGroup}>
        Create Group
      </Button>
      {groups ? (
        <ul className="list-group mt-3">
          {groups.map((group) => (
            <li key={group.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <span>{group.name}</span>
                {groupMembers && groupPersonMap[group.id] && (
                  <div className="d-flex flex-wrap">
                    {groupPersonMap[group.id].map((memberName) => (
                      <Chip
                        key={memberName}
                        label={memberName}
                        onDelete={() => handleRemovePersonFromGroup(group.id, memberName)}
                        variant="outlined"
                        className="m-1"
                      />
                    ))}
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Add person..."
                        value={inputValues[group.id] || ''}
                        onChange={(e) => handleInputChange(group.id, e)}
                      />
                    </InputGroup>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No groups available</p>
      )}
      <Button variant="success" className="mt-3" onClick={handleSave}>
        Save Group Members
      </Button>
    </div>
  );
};

export default Groups;

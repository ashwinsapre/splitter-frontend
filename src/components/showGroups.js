import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import Chip from '@mui/material/Chip';

const Groups = ({ people }) => {
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState(null);
  const [groupPersonMap, setGroupPersonMap] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const toCamelCase = (name) => {
    return name.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

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
          initialMap[member.groupId].push(
            people.find((person) => person.id === member.personId).name
          );
        });
        groups.forEach((group) => {
          if (!initialMap[group.id]) {
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

  const handleRemoveGroup = async (groupId) => {
    try {
      // Use axios.delete with a URL that includes the groupId as a path variable
      const response = await axios.delete(`http://localhost:8080/groups/removeGroup/${groupId}`);
      console.log('Group removal successful:', response.data);
  
      // After successful deletion, fetch the updated list of groups
      fetchGroups();
    } catch (error) {
      console.error('Group removal unsuccessful:', error);
    }
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

  const handleConfirmCreateGroup = async () => {
    handleClose();

    const formData = new FormData();
    formData.append('name', newGroupName);

    try {
      await axios.post('http://localhost:8080/groups', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error uploading group:', error);
    }

    fetchGroups();
  };

  return (
    <div className="container mt-5">
      <Card className="mt-3 mb-0" style={{ cursor: 'pointer' }} onClick={handleShow}>
        <Card.Body style={{ backgroundColor: '#e7f0f7' }}>
          <Card.Title style={{ fontWeight: 'bold' }}>Create New Group</Card.Title>
        </Card.Body>
      </Card>
      {groups ? (
        <div className="mt-3">
          {groups.map((group) => (
            <Card key={group.id} className="mt-3 mb-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>{group.name}</Card.Title>
                  {groupMembers && groupPersonMap[group.id] && (
                    <div className="d-flex flex-wrap">
                      {groupPersonMap[group.id].map((memberName) => (
                        <Chip
                          key={memberName}
                          label={toCamelCase(memberName)}
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
                  <Button
                    variant="danger"
                    style={{ backgroundColor: 'white', color: 'red', border: 'none' }}
                    onClick={() => handleRemoveGroup(group.id)}
                    className="ml-2"
                  >
                    &#10006; {/* Unicode for cross sign */}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p>No groups available</p>
      )}
      <Button className="mt-3" onClick={handleSave} style={{ borderColor: '#ffc120', fontWeight: 'bold', backgroundColor: '#0071ce' }}>
        Save Group Members
      </Button>

      {/* Modal for creating a new group */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGroupName" className="mb-3">
              <Form.Label>Group Name:</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewGroupName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmCreateGroup}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Groups;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chip from '@mui/material/Chip';

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
        console.log("group members data:", initialMap);
        setGroupPersonMap(initialMap);
      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    };
    fetchGroupMembers();
    }, [groups]); // Include people as a dependency to ensure the correct person data is used

  const handleRemovePersonFromGroup = (groupID, personName) => {
    console.log(`Removing ${personName} from group ${groupID}`);
    // Copy the current mapping
    const updatedGroupPersonMap = { ...groupPersonMap };

    // Remove the person from the group
    updatedGroupPersonMap[groupID] = updatedGroupPersonMap[groupID].filter(
      (name) => name !== personName
    );

    // Update the state
    setGroupPersonMap(updatedGroupPersonMap);
  };

  const handleInputChange = (groupID, event) => {
    const value = event.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [groupID]: value,
    }));

    // Automatically add the person to the group if their name matches and they are not already in the group
    const person = people.find((person) => person.name.toLowerCase() === value.toLowerCase());
    if (person && !groupPersonMap[groupID]?.includes(person.name)) {
      setGroupPersonMap((prevMap) => ({
        ...prevMap,
        [groupID]: [...(prevMap[groupID] || []), person.name],
      }));
      setInputValues((prevValues) => ({
        ...prevValues,
        [groupID]: '', // Clear the input field after adding
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
    console.log(payload);

    try {
      const response = await axios.post('http://localhost:8080/groups/saveGroup', payload);
      console.log('Group members saved successfully:', response.data);
      // Add any additional handling for success
    } catch (error) {
      console.error('Error saving group members:', error);
      // Add any error handling
    }
  };

  const handleCreateGroup = async () => {
    const groupName = prompt('Enter group name:'); // You can use a UI component for a better user experience
    if (groupName) {
      const formData = new FormData();
      formData.append('name', groupName);
      try{
        axios.post('http://localhost:8080/groups', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },});
      }
      catch(error){
        console.error('Error uploading group:', error);
      }
    }
    fetchGroups();
  };

  return (
    <div>
      <h2>Groups</h2>
      <button onClick={handleCreateGroup}>Create Group</button>
      {groups ? (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              {group.name}
              {groupMembers && groupPersonMap[group.id] && (
                <div>
                  {groupPersonMap[group.id].map((memberName) => (
                    <Chip
                      key={memberName}
                      label={memberName}
                      onDelete={() => handleRemovePersonFromGroup(group.id, memberName)}
                      variant="outlined"
                    />
                  ))}
                  <input
                    type="text"
                    placeholder="Add person..."
                    value={inputValues[group.id] || ''}
                    onChange={(e) => handleInputChange(group.id, e)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No groups available</p>
      )}
      <button onClick={handleSave}>Save Group Members</button>
    </div>
  );
};

export default Groups;
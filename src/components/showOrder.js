import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import { Button, Table, Card, Badge } from 'react-bootstrap';

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState();
  const [orderID, setOrderID] = useState("id");
  const [people, setPeople] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [itemChips, setItemChips] = useState({});
  const [personTotals, setPersonTotals] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [groups, setGroups] = useState();
  const [groupNames, setGroupNames] = useState();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  useEffect(() => {
    axios.get(`http://localhost:8080/groups/get`)
        .then(response => {
          setGroups(response.data);
          
          console.log('Received groups details:', groups);
        })
        .catch(error => console.error('Error fetching group members:', error));
    
    axios.get(`http://localhost:8080/groups`)
        .then(response => {
          setGroupNames(response.data);
          
          console.log('Received groups names:', groupNames);
        })
        .catch(error => console.error('Error fetching group names:', error));
  }, [itemChips]);

  useEffect(() => {
    const currentURL = window.location.href;
    const orderId = currentURL.split("/orders/")[1];
    
    if (orderId !== undefined) {
      console.log('Fetching order details...');
      setOrderID(orderId);
  
      axios.get(`http://localhost:8080/orders/${orderId}`)
        .then(response => {
          console.log('Received order details:', response.data);
          if (response) {
            setOrderDetails(response.data);
          }
        })
        .catch(error => console.error('Error fetching order details:', error));
    }
  }, []); // Empty dependency array to fetch order details only once
  
  useEffect(() => {
    // Fetch shares only if both people and orderDetails are available
    if (people && orderDetails) {
      axios.get(`http://localhost:8080/saveOrder/${orderID}`)
        .then(response => {
          console.log('Received shares:', response.data);
          // Set itemChips based on the received shares
          const newChips = {};
          response.data.forEach(share => {
            if (!newChips[share.itemName]) {
              newChips[share.itemName] = [];
            }
            newChips[share.itemName].push({
              id: share.personId,
              name: people.find(person => person.id === share.personId)?.name,
              quantity: share.item_qty,
              price: share.item_price
            });
          });
          setItemChips(newChips);
        })
        .catch(error => console.error('Order has not been split yet', error));
    }
  }, [people, orderDetails, orderID]);

  useEffect(() => {
    axios.get(`http://localhost:8080/person`)
      .then(response => {
        console.log('Received all people:', response.data);
        setPeople(response.data);
      })
      .catch(error => console.error('Error fetching person details:', error));
  }, []);

  useEffect(() => {
    // Calculate person totals whenever itemChips changes
    const newPersonTotals = {};
  
    for (const itemName in itemChips) {
      const chips = itemChips[itemName];
      chips.forEach(chip => {
        if (newPersonTotals[chip.id] === undefined) {
          newPersonTotals[chip.id] = 0;
        }
  
        // Find the corresponding item to get the correct price
        const item = orderDetails.find(item => item.name === itemName);
  
        if (item) {
          // Calculate the person's share for one particular item
          const personShare = chip.quantity * item.price;
  
          // Increment the total amount for the person
          newPersonTotals[chip.id] += personShare;
        }
      });
    }
  
    setPersonTotals(newPersonTotals);
  }, [itemChips, orderDetails]);
  

  const handleClearAllChips = () => {
    setItemChips({});
    setUnsavedChanges(false);
  };
  
  const isChipExists = (itemName, chipName) => {
    return (
      itemChips[itemName] &&
      itemChips[itemName].some(chip => chip.name.toLowerCase() === chipName.toLowerCase())
    );
  };

  const handleInputChange = async (event, itemName) => {
    const value = event.target.value;
  
    // Check if value is not undefined or null before proceeding
    if (value !== undefined && value !== null) {
      setInputValues((prevValues) => ({
        ...prevValues,
        [itemName]: value,
      }));
  
      // Check if the input matches the name of a group
      const matchedGroup = groupNames ? groupNames.find((groupName) => groupName.name === value.toLowerCase()) : null;
  
      if (matchedGroup) {
        console.log("found group!");
        try {
          // Get the ID of the matched group
          const groupId = matchedGroup.id;
          console.log(groupId);
  
          console.log(groups);
          // Check the groups state to get the list of people IDs associated with that group
          const groupMembersIds = groups ? groups.filter((group) => group.groupId === groupId)?.map(group => group.personId).flat() : [];

  
          console.log("personIDs in this group=",groupMembersIds);
          // Check if groupMembersIds is not undefined before proceeding
          if (groupMembersIds) {
            groupMembersIds.forEach((personId) => {
              const matchedPerson = people.find((person) => person.id === personId);
  
              if (matchedPerson && !isChipExists(itemName, matchedPerson.name)) {
                const item = orderDetails.find((item) => item.name === itemName);
  
                // Ensure the number inside the chip is not greater than the item quantity
                const numberOfChips = itemChips[itemName] ? itemChips[itemName].length : 0;
                const initialQuantity = item.quantity / (numberOfChips + 1);
  
                setItemChips((prevChips) => ({
                  ...prevChips,
                  [itemName]: [
                    ...(prevChips[itemName] || []),
                    {
                      id: matchedPerson.id,
                      name: matchedPerson.name,
                      quantity: parseFloat(initialQuantity),
                    },
                  ],
                }));
              }
            });
  
            // Clear the input field after successfully adding the chips
            setInputValues((prevValues) => ({
              ...prevValues,
              [itemName]: '',
            }));
  
            setUnsavedChanges(true);
          }
        } catch (error) {
          console.error('Error fetching group members:', error);
        }
      } else {
        // Handle the case where the input is not a group name
        const matchedPerson = people.find((person) => person.name.toLowerCase() === value.toLowerCase());
  
        if (matchedPerson && !isChipExists(itemName, matchedPerson.name)) {
          const item = orderDetails.find((item) => item.name === itemName);
  
          // Ensure the number inside the chip is not greater than the item quantity
          const numberOfChips = itemChips[itemName] ? itemChips[itemName].length : 0;
          const initialQuantity = item.quantity / (numberOfChips + 1);
  
          setItemChips((prevChips) => ({
            ...prevChips,
            [itemName]: [
              ...(prevChips[itemName] || []),
              {
                id: matchedPerson.id,
                name: matchedPerson.name,
                quantity: parseFloat(initialQuantity),
              },
            ],
          }));
  
          // Clear the input field after successfully adding the chip
          setInputValues((prevValues) => ({
            ...prevValues,
            [itemName]: '',
          }));
        }
  
        setUnsavedChanges(true);
      }
    }
  };
  
  const handleRemoveChip = (itemName, chipId) => {
    setItemChips(prevChips => {
      const updatedChips = { ...prevChips };
      updatedChips[itemName] = updatedChips[itemName].filter(chip => chip.id !== chipId);
      return updatedChips;
    });
    setUnsavedChanges(true);
  };
  
  const handleQuantityChange = (itemName, chipId, newQuantity) => {
    const item = orderDetails.find((item) => item.name === itemName);
  
    // Check if the new quantity is within the valid range
    if (newQuantity >= 0 && newQuantity <= item.quantity) {
      setItemChips((prevChips) => {
        const updatedChips = { ...prevChips };
        const chipIndex = updatedChips[itemName].findIndex(
          (chip) => chip.id === chipId
        );
        if (chipIndex !== -1) {
          // Create a new array to trigger a re-render
          updatedChips[itemName] = [
            ...updatedChips[itemName].slice(0, chipIndex),
            { ...updatedChips[itemName][chipIndex], quantity: newQuantity },
            ...updatedChips[itemName].slice(chipIndex + 1),
          ];
        }
        return updatedChips;
      });
    } else {
      // Notify the user that the quantity exceeds the item quantity
      console.warn(
        `The quantity in the chip for ${itemName} cannot exceed the item quantity (${item.quantity}).`
      );
    }
    setUnsavedChanges(true);
  };
  
  const handleSave = async () => {
    // Check if all items have at least one chip
    const allItemsHaveChips = orderDetails.every(item => itemChips[item.name] && itemChips[item.name].length > 0);

    if (allItemsHaveChips) {
      // Validate the sum of chip quantities against the item quantity
      const isQuantitiesValid = orderDetails.every(item => {
        const chips = itemChips[item.name] || [];
        const sumQuantities = chips.reduce((sum, chip) => sum + chip.quantity, 0);
        return Math.abs(sumQuantities - item.quantity)/sumQuantities < 0.01;
      });

      if (isQuantitiesValid) {
        // Extract item details from the chips
        const orderData = orderDetails.map(item => {
          const chips = itemChips[item.name];
          return chips.map(chip => ({
            itemName: item.name,
            person_id: chip.id, // Assuming the person name is the ID, you might need to adjust this
            item_price: item.price,
            quantity: chip.quantity,
          }));
        }).flat();

        // Send information to the endpoint
        const payload = {
          orderID,
          items: orderData,
          // Add any other information you want to send
        };

        try {
          const response = await axios.post('http://localhost:8080/saveOrder', payload);
          console.log('Order saved successfully:', response.data);
          // Handle success, e.g., show a success message to the user
        } catch (error) {
          console.error('Error saving order:', error);
          // Handle error, e.g., show an error message to the user
        }
      } else {
        // Handle the case where the sum of chip quantities exceeds the item quantity
        console.warn('The sum of quantities in chips for each item must be equal to the item quantity.');
      }
    } else {
      // Handle the case where not all items have at least one chip
      console.warn('Please add at least one chip to each item before saving.');
    }
    setUnsavedChanges(false);
  };
  const handleBeforeUnload = (event) => {
    if (unsavedChanges) {
      const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };

  const handleClose = () => {
    // Navigate to "/orders" when the "Close" button is clicked
    window.location.href = `/orders/`;
    
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const handleItemNameDoubleClick = (itemName) => {
    const item = orderDetails.find((item) => item.name === itemName);
    const chips = itemChips[itemName];
  
    if (item && chips && chips.length > 0) {
      const totalQuantity = item.quantity;
      const equalShare = totalQuantity / chips.length;
  
      // Update each chip's quantity with the equal share
      setItemChips((prevChips) => ({
        ...prevChips,
        [itemName]: prevChips[itemName].map((chip) => ({
          ...chip,
          quantity: equalShare,
        })),
      }));
    }
  };

  if (!orderDetails) {
    return <div></div>;
  }

  return (
    <div className="container mt-5">
      <h1>Order Details for Order ID: {orderID} <Button variant="primary" onClick={handleSave}>Save</Button></h1>
      <div className="d-flex flex-row mt-4">
        {people && itemChips &&
          people
            .filter(person => Object.values(itemChips).flat().some(chip => chip.id === person.id))
            .map(person => (
              <Card key={person.id} className="mr-3">
                <Card.Body>
                  <Card.Title>{person.name}</Card.Title>
                  <Card.Text>Total: {personTotals[person.id] || 0}</Card.Text>
                </Card.Body>
              </Card>
            ))}
      </div>
      <Button variant="danger" className="mt-3" onClick={handleClearAllChips}>Clear All Chips</Button>
      <Button variant="secondary" className="mt-3 ml-2" onClick={handleClose}>Close</Button> {/* Close button */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Chips</th>
            <th>Add Person</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map(item => (
            <tr key={item.name}>
              <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  onDoubleClick={() => handleItemNameDoubleClick(item.name)}
              >
                {item.name}
              </td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>
                {itemChips[item.name] &&
                  itemChips[item.name].map((chip, index) => (
                    <Chip
                      key={chip.id}
                      label={`${chip.name} - ${chip.quantity.toFixed(2)}`} // Display float with 2 decimal places
                      id={chip.id}
                      onDelete={() => handleRemoveChip(item.name, chip.id)}
                      variant="outlined"
                      onClick={() => {
                        const newQuantity = parseFloat(
                          prompt(`Enter new quantity for ${chip.name}`, chip.quantity)
                        );
                        if (!isNaN(newQuantity) && newQuantity >= 0) {
                          handleQuantityChange(item.name, chip.id, newQuantity);
                        }
                      }}
                    />
                ))}
              </td>
              <td>
                <input
                  type="text"
                  value={inputValues[item.name] || ''}
                  onChange={(e) => handleInputChange(e, item.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderDetails;

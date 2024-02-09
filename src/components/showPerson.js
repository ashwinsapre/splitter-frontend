import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonDetails = ({ people }) => {
  const [personID, setPersonID] = useState(0);
  const [personName, setPersonName] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalSpentOnEachOrder, setTotalSpentOnEachOrder] = useState([]);
  const [stats, setStats] = useState(null);

  const toCamelCase = (name) => {
    return name.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    const currentURL = window.location.href;
    const pid = parseInt(currentURL.split("/person/")[1]);
    setPersonID(pid);
    console.log("current personID=", pid);
    if (pid) {
      axios.get(`http://localhost:8080/person/${pid}`)
        .then(response => {
          console.log(response.data.flat());
          setOrderHistory(response.data.flat());
          const orders = response.data.flat(); // Flatten the nested arrays
          const orderTotals = new Map();

          // Create a mapping of order IDs and order totals
          orders.forEach(order => {
            const orderId = order.orderId;
            const itemPrice = order.item_price*order.item_qty;
            if (orderTotals.has(orderId)) {
              orderTotals.set(orderId, orderTotals.get(orderId) + itemPrice);
            } else {
              orderTotals.set(orderId, itemPrice);
            }
          });
          setTotalSpentOnEachOrder([...orderTotals]); // Convert Map to array
          
          const itemStatistics = {};
          orders.forEach(order => {
            const itemName = order.itemName;
            const orderAmount = order.item_price*order.item_qty;
            if (itemName in itemStatistics) {
              itemStatistics[itemName].count++;
              itemStatistics[itemName].totalSpent += orderAmount;
            } else {
              itemStatistics[itemName] = {
                count: 1,
                totalSpent: orderAmount
              };
            }
          });
          setStats(itemStatistics);
        })
        .catch(error => {
          console.error('Error fetching person details:', error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => { 
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/orders`);
        const allOrders = response.data;
        setOrders(allOrders);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    if (people && personID) {
      const foundPerson = people.find(person => person.id === personID);
      if (foundPerson) {
        setPersonName(foundPerson.name);
      }
    }
  }, [people, personID]);

  

  // Function to get top 3 items by total spent
  const getTopItems = () => {
    if (stats !== null) {
      const sortedItems = Object.entries(stats).sort(([,a],[,b]) => b.totalSpent - a.totalSpent);
      return sortedItems.slice(0, 3);
    }
    return [];
  }

  return (
    <div style={{ color: '#333' }}>
      <h1 style={{ color: '#0071dc' }}>{toCamelCase(personName)}</h1>
      <h2 style={{ color: '#0071dc' }}>Your favorite items</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {getTopItems().map(([itemName, { count, totalSpent }], index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <span style={{ color: '#0071dc', marginRight: '10px' }}>{itemName}:</span>
            <span>Count - {count}, Total Spent - {totalSpent.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <h2 style={{ color: '#0071dc' }}>Spending Summary</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Order ID</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Amount Spent</th>
          </tr>
        </thead>
        <tbody>
          {totalSpentOnEachOrder.map(([orderId, amountSpent], index) => {
            const order = orders.find(item => item.orderId === orderId);
            if (order) {
              return (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{order.date}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{amountSpent.toFixed(2)}</td>
                </tr>
              );
            } else {
              return null; // Handle case where order is not found
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PersonDetails;

import React, { useState, useEffect } from 'react';

const Home = () => {
  return (
    <div>
      <h2 onClick={() => window.location.href='/orders'}>Click here to manage orders</h2>
      <h2 onClick={() => window.location.href='/person'}>Click here to manage people</h2>
    </div>
  );
};

export default Home;
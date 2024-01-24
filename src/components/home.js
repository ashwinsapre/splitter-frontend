import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="container-fluid">
    <div className="row">
      
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to Your Dashboard</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Manage Orders</h5>
              <p className="card-text">Click here to manage orders</p>
              <a href="/orders" className="btn btn-primary">
                Go to Orders
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Manage People</h5>
              <p className="card-text">Click here to manage people</p>
              <a href="/person" className="btn btn-primary">
                Go to People
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Home;

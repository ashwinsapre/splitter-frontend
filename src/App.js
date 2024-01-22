import React from 'react';
import FileUpload from './components/fileUpload';
import PersonList from './components/showPeople';
import Home from './components/home';

function App() {
  const pathname = window.location.pathname;

  return (
    <div className="App">
    <a href="http://localhost:3000/home">
      <h1>Walmart Invoice Splitter</h1>
    </a>
    <div style={{ display: 'flex' }}>
      {pathname.includes('/person') && <PersonList />}
      {pathname.includes('/orders') && <FileUpload />}
      {pathname.includes('/home') && <Home />}
    </div>
  </div>
  );
}
export default App;

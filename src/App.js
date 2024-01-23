import React from 'react';
import FileUpload from './components/fileUpload';
import PersonList from './components/showPeople';
import PeopleAndGroups from './components/showPeopleAndGroups';
import Home from './components/home';

function App() {
  const pathname = window.location.pathname;

  return (
    <div className="App">
    <div style={{ display: 'flex' }}>
      {pathname.includes('/person') && <PersonList />}
      {pathname.includes('/orders') && <FileUpload />}
      {pathname.includes('/home') && <Home />}
    </div>
  </div>
  );
}
export default App;

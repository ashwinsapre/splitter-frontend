import React from 'react';
import PersonList from './showPeople'; // Assuming this is the file containing the People component
import Groups from './showGroups'; // Assuming this is the file containing the Groups component

const PeopleAndGroups = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          {/* People Component */}
          <PersonList />
        </div>
        <div className="col-md-6">
          {/* Groups Component */}
          <Groups />
        </div>
      </div>
    </div>
  );
};

export default PeopleAndGroups;

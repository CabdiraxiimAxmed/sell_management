import React from 'react'

const PermissionDenied: React.FC = () => {
  console.log("permision denied");
  return (
    <div className="permission-denied-container">
      <h1><code>Access Denied</code></h1>
      <h3>You don't have permission to view this site.</h3>
      <h3>🚫🚫🚫🚫</h3>
      <h6>error code:403 forbidden</h6>
    </div>
  );
};

export default PermissionDenied;

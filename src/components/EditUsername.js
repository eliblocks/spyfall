import React, { useState } from 'react';
import { GoPencil } from "react-icons/go";

function EditUsername({username, setUsername, updateUsername}) {
  const [editingUsername, setEditingUsername] = useState(false);

  function handleUpdateUsername() {
    updateUsername()
    setEditingUsername(false)
  }

  return (
    editingUsername ?
      <input
        className="form-control"
        placeholder={username} 
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleUpdateUsername}
        autoFocus
      />
    : <div>
        <span>{username}</span>
        <button className="btn btn-default" onClick={() => setEditingUsername(true)}>
          <GoPencil />
        </button>
      </div>
  )
}

export default EditUsername;
import React, { useState, useEffect } from 'react';
import locations from './locations'

function Play({ game, userId, quit, activeUsers }) {
  return (
    <div className="container">
      {game.spy === userId ? 
        <h1 className="mt-1">You are the spy!</h1>
      :
        <div>
          <h1 className="mt-1">You are not the spy!</h1>
          <h4 className="mt-1">Location: {game.location}</h4>
        </div>
      }
      <h4 className="mt-4 mb-3">Players</h4>
      <div className="row">
        {Object.keys(activeUsers()).map(uid =>
          <div className="list-group-item col-6">{game.users[uid].username}</div>
        )}
      </div>
      <h4 className="mt-4 mb-3">Locations Reference</h4>
      <div class="row">
        {locations().map(location =>
          <div className="list-group-item col-6">{location}</div>
        )}
      </div>
      <button className="btn btn-secondary btn-lg mt-4 mb-4" onClick={quit}>Quit game</button>
    </div>
  );
}

export default Play;
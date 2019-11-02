import React, { useState, useEffect } from 'react';

function Play({ game, userId, quit }) {
  console.log(game.userId)
  console.log(userId)
  return (
    <div>
      {game.spy === userId ? 
        <h1>You are the spy!</h1>
      :
        <h1>You are not the spy!</h1>
      }
      
      <button class="btn btn-primary" onClick={quit}>Quit</button>
    </div>
  );
}

export default Play;
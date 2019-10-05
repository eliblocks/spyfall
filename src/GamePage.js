import React, { useState, useEffect } from 'react';
import database from './firebase';

function GamePage(props) {
  return (
    <div>
      <h2>Game: {props.gameObject}</h2>
      <h4>Status: Waiting</h4>
      <form>
        <input type="button" value="Create New Game" onClick={props.handleSubmit} />
      </form>
    </div>
  );
}

export default GamePage;
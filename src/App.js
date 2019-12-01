import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import database from './firebase';
import Home from './Home';
import GamePage from './GamePage';
import Instructions from './Instructions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  function createGame() {
    let game = Math.random().toString(36).substr(2, 5)
    database.ref(`games/${game}`).set({status: "waiting", gameId: game});
    return game
  }

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home createGame={createGame}/>
          </Route>
          <Route path="/instructions">
            <Instructions />
          </Route>
          <Route path="/:gameId">
            <GamePage createGame={createGame} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

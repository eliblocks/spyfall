import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import database from './firebase';
import Home from './components/Home';
import GamePage from './components/GamePage';
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
          <Route path="/:gameId">
            <GamePage createGame={createGame} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

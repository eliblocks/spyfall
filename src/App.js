import React, { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import database from './firebase';
import Home from './Home';
import GamePage from './GamePage';
import './App.css';

function App() {
  const [gameId, setGameId] = useState('')

  const history = createBrowserHistory();

  useEffect(() => {
    let page = history.location.pathname.replace("/", "")

    if (page) {
      database.ref(`games/${page}`).on('value', function(snapshot) {
        let gameData = snapshot.val()
        if (gameData) {
          localStorage.setItem('game', page)
        } else {
          history.push('/')
        }
        setGameId(page)
      });
    } else {
      let storedGameId = localStorage.getItem('game')
      if (storedGameId) {
        history.push(`/${storedGameId}`)
        setGameId(storedGameId)
      }
    }
  });

  function handleSubmit() {
    let game = Math.random().toString(36).substr(2, 5)
    database.ref(`games/${game}`).set({status: "waiting"});
    history.push(`/${game}`)
    setGameId(game)
  }

  return (
    <div className="App">
      {gameId ?
        <GamePage gameObject={gameId} handleSubmit={handleSubmit}/>
        : <Home handleSubmit={handleSubmit} />}
    </div>
  );
}

export default App;

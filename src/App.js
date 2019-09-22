import React, { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import database from './firebase';

import './App.css';

function GamePage(props) {
  return (
    <div>
      <h2>Game: {props.gameObject}</h2>
      <form>
        <input type="button" value="Create New Game" onClick={props.handleSubmit} />
      </form>
    </div>
  );
}

function Home(props) {
  return (
    <form>
      <input type="button" value="Create Game" onClick={props.handleSubmit} />
    </form>
  );
}

function App() {
  const [gameId, setGameId] = useState('')

  const history = createBrowserHistory();

  useEffect(() => {
    history.listen((location) => {
      console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
    });

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
    // localStorage.setItem('game', game);
    database.ref(`games/${game}`).set({status: game});
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

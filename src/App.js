import './App.css';
import React, { useState, useEffect } from 'react';
import GameScore from './modules/GameScore/GameScore.js';
import PastGames from './modules/PastGames/PastGames.js';

function App() {
    const [pastGames, setPastGames] = useState(() => {
        const savedPastGames = localStorage.getItem('pastGames');
        return savedPastGames ? JSON.parse(savedPastGames) : [];
    });

    useEffect(() => {
        localStorage.setItem('pastGames', JSON.stringify(pastGames));
    }, [pastGames]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Golf Score Tracker</h1>
                <GameScore setPastGames={setPastGames} />
                <h1>Past Games:</h1>
                <PastGames pastGames={pastGames} setPastGames={setPastGames} />
                <button
                  onClick={() => {
                    const json = JSON.stringify(pastGames);
                    navigator.clipboard.writeText(json).then(() => {
                      alert('Past games copied to clipboard');
                    });
                  }}
                >
                  Export Past Games
                </button>
                <button
                  onClick={() => {
                    const json = prompt('Paste your past games JSON here:');
                    if (json) {
                      try {
                        const importedPastGames = JSON.parse(json);
                        setPastGames(importedPastGames);
                      } catch (e) {
                        alert('Invalid JSON');
                      }
                    }
                  }}
                >
                  Import Past Games
                </button>
            </header>
        </div>
    );
}

export default App;

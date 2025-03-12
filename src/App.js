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
                <PastGames pastGames={pastGames} />
            </header>
        </div>
    );
}

export default App;

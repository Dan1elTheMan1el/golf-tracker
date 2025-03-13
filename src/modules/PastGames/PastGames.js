import React, { useState } from 'react';
import './PastGames.css'; // Import the CSS file

const PastGames = ({ pastGames, setPastGames }) => {
    const [selectedGame, setSelectedGame] = useState(null);

    const handleGameClick = (game) => {
        setSelectedGame(game);
    };

    const handleCloseModal = () => {
        setSelectedGame(null);
    };

    const handleDeleteGame = (game) => {
        if (window.confirm('Are you sure you want to delete this game?')) {
            setPastGames(pastGames.filter(g => g !== game));
            setSelectedGame(null);
        }
    };

    const getScoreColorClass = (score) => {
        const parsedScore = parseInt(score, 10);
        if (isNaN(parsedScore)) return '';
        if (parsedScore <= 0) return 'score-green';
        if (parsedScore <= 14) return 'score-white';
        if (parsedScore <= 24) return 'score-yellow';
        return 'score-red';
    };

    return (
        <div className="pastGames">
            {pastGames.length === 0 ? (
                <p>No past games available.</p>
            ) : (
                <ul>
                    {pastGames
                        .slice()
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((game, index) => (
                            <li key={index}>
                                <h3 onClick={() => handleGameClick(game)}>{game.name}</h3>
                                <p>{new Date(game.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</p>
                                <p>
                                    {game.columns.map((column, colIndex) => (
                                        <span key={colIndex}>
                                            {game.headers[colIndex]}: {column.reduce((total, score) => total + (parseFloat(score) || 0), 0)}
                                            {colIndex < game.columns.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                            </li>
                        ))}
                </ul>
            )}

            {selectedGame && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <span className="delete" onClick={() => handleDeleteGame(selectedGame)}>🗑️</span>
                        <h2>{selectedGame.name}</h2>
                        <p>Date: {new Date(selectedGame.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</p>
                        <div className="scoreTable">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {selectedGame.headers.map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedGame.columns[0].map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td style={{ color: selectedGame.wildRounds[rowIndex] ? 'violet' : 'inherit' }}>
                                                {rowIndex + 1}{selectedGame.wildRounds[rowIndex] ? '*' : ''}
                                            </td>
                                            {selectedGame.columns.map((column, colIndex) => (
                                                <td key={colIndex} className={`scoreCell ${getScoreColorClass(column[rowIndex])}`}>
                                                    {column[rowIndex]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>
                                            <hr />
                                            Totals
                                        </td>
                                        {selectedGame.columns.map((column, colIndex) => (
                                            <td key={colIndex} className="scoreCell">
                                                <hr />
                                                {column.reduce((total, score) => total + (parseFloat(score) || 0), 0)}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PastGames;

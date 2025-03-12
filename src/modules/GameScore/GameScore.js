import React, { useState, useEffect } from 'react';
import './GameScore.css'; // Import the CSS file

const GameScore = ({ setPastGames }) => {
    const [columns, setColumns] = useState(() => {
        const savedGameState = localStorage.getItem('gameState');
        return savedGameState ? JSON.parse(savedGameState).columns : [[]];
    });
    const [inputs, setInputs] = useState(() => {
        const savedGameState = localStorage.getItem('gameState');
        return savedGameState ? JSON.parse(savedGameState).inputs : [''];
    });
    const [headers, setHeaders] = useState(() => {
        const savedGameState = localStorage.getItem('gameState');
        return savedGameState ? JSON.parse(savedGameState).headers : ['Column 1'];
    });
    const [isEditing, setIsEditing] = useState(false);
    const [numColumns, setNumColumns] = useState(() => {
        const savedGameState = localStorage.getItem('gameState');
        return savedGameState ? JSON.parse(savedGameState).numColumns : 1;
    });
    const [wildRound, setWildRound] = useState(false);
    const [wildRounds, setWildRounds] = useState(() => {
        const savedGameState = localStorage.getItem('gameState');
        return savedGameState ? JSON.parse(savedGameState).wildRounds : [];
    });

    useEffect(() => {
        const gameState = {
            columns,
            inputs,
            headers,
            numColumns,
            wildRounds
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }, [columns, inputs, headers, numColumns, wildRounds]);

    const handleInputChange = (index, event) => {
        const value = event.target.value;
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue) || value === '' || value === '-') {
            const newInputs = [...inputs];
            newInputs[index] = value === '' || value === '-' ? value : parsedValue.toString();
            setInputs(newInputs);
        }
    };

    const handleAddScore = () => {
        const newColumns = columns.map((column, index) => [...column, inputs[index] === '' ? 0 : inputs[index]]);
        setColumns(newColumns);
        setInputs(inputs.map(() => ''));
        setWildRounds([...wildRounds, wildRound]);
        setWildRound(false);
    };

    const handleHeaderChange = (index, event) => {
        const newHeaders = [...headers];
        newHeaders[index] = event.target.value;
        setHeaders(newHeaders);
    };

    const calculateColumnTotal = (column) => {
        return column.reduce((total, score) => total + (parseFloat(score) || 0), 0);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleNumColumnsChange = (event) => {
        const newNumColumns = parseInt(event.target.value, 10);
        if (newNumColumns > numColumns) {
            const newColumns = [...columns, ...Array(newNumColumns - numColumns).fill(Array(columns[0].length).fill(0))];
            const newHeaders = [...headers, ...Array(newNumColumns - numColumns).fill(`Column ${headers.length + 1}`)];
            const newInputs = [...inputs, ...Array(newNumColumns - numColumns).fill('')];
            setColumns(newColumns);
            setHeaders(newHeaders);
            setInputs(newInputs);
        } else if (newNumColumns < numColumns) {
            setColumns(columns.slice(0, newNumColumns));
            setHeaders(headers.slice(0, newNumColumns));
            setInputs(inputs.slice(0, newNumColumns));
        }
        setNumColumns(newNumColumns);
    };

    const handleRemoveRow = (rowIndex) => {
        const newColumns = columns.map(column => column.filter((_, index) => index !== rowIndex));
        setColumns(newColumns);
        const newWildRounds = [...wildRounds];
        newWildRounds.splice(rowIndex, 1);
        setWildRounds(newWildRounds);
    };

    const handleScoreChange = (colIndex, rowIndex, event) => {
        const value = event.target.value;
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue) || value === '' || value === '-') {
            const newColumns = [...columns];
            newColumns[colIndex][rowIndex] = value === '' || value === '-' ? value : parsedValue.toString();
            setColumns(newColumns);
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

    const handleSaveGame = () => {
        const gameName = prompt('Enter a name for this game:');
        if (!gameName) return;

        const gameState = {
            name: gameName,
            date: new Date().toISOString(),
            columns,
            headers,
            wildRounds
        };

        setPastGames(prevGames => [...prevGames, gameState]);

        // Clear current game state (only scores)
        const clearedColumns = columns.map(column => column.map(() => 0));
        setColumns(clearedColumns);
        setInputs(inputs.map(() => ''));
        setWildRounds([]);
        setWildRound(false);
        localStorage.removeItem('gameState');
    };

    useEffect(() => {
        if (isEditing) {
            const inputs = document.querySelectorAll('.editable-input');
            inputs.forEach(input => {
                const span = document.createElement('span');
                span.style.visibility = 'hidden';
                span.style.position = 'absolute';
                span.style.whiteSpace = 'pre';
                span.style.font = window.getComputedStyle(input).font;

                span.textContent = input.value;
                document.body.appendChild(span);
                input.style.width = span.offsetWidth + 'px';
                document.body.removeChild(span);

                input.addEventListener('input', () => {
                    span.textContent = input.value;
                    input.style.width = span.offsetWidth + 'px';
                });
            });
        }
    }, [isEditing, headers, columns]);

    return (
        <div>
            <div id="columnsContainer" className="controlsRow">
                Wild?
                <input
                    type="checkbox"
                    checked={wildRound}
                    onChange={() => setWildRound(!wildRound)}
                />
                {inputs.map((input, index) => (
                    <input
                        key={index}
                        type="text"
                        className="scoreInput"
                        value={input}
                        onChange={(event) => handleInputChange(index, event)}
                    />
                ))}
            </div>
            <button id="addButton" onClick={handleAddScore}>Add Score</button>
            <div className="controlsRow">
                <label htmlFor="numColumns">Players: </label>
                <input
                    id="numColumns"
                    type="number"
                    min="1"
                    value={numColumns}
                    onChange={handleNumColumnsChange}
                    className="numColumnsInput"
                />
                <button onClick={toggleEditing}>{isEditing ? 'Disable Editing' : 'Enable Editing'}</button>
            </div>
            
            <div className="scoreTable">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            {headers.map((header, index) => (
                                <th key={index}>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={header} 
                                            onChange={(event) => handleHeaderChange(index, event)} 
                                            className="editable-input"
                                        />
                                    ) : (
                                        header
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {columns[0].map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                <td onClick={() => isEditing && handleRemoveRow(rowIndex)} style={{ cursor: isEditing ? 'pointer' : 'default', color: wildRounds[rowIndex] ? 'violet' : 'inherit' }}>
                                    {rowIndex + 1}{wildRounds[rowIndex] ? '*' : ''}
                                </td>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className={`scoreCell ${getScoreColorClass(column[rowIndex])}`}>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={column[rowIndex]} 
                                                onChange={(event) => handleScoreChange(colIndex, rowIndex, event)}
                                                className="editable-input"
                                            />
                                        ) : (
                                            column[rowIndex]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        )).reverse()}
                        <tr>
                            <td>
                                <hr />
                                Totals
                            </td>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="scoreCell">
                                    <hr />
                                    {calculateColumnTotal(column)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <button onClick={handleSaveGame}>Save Game</button>
        </div>
    );
};

export default GameScore;
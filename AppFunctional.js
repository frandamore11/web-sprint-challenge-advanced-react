import React, { useState, useEffect } from 'react';

export default function AppFunctional(props) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [steps, setSteps] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(4);

  useEffect(() => {
    console.log(`Updated currentIndex: ${currentIndex}`);
  }, [currentIndex]);

  function getXY() {
    const x = (currentIndex % 3) + 1;
    const y = Math.floor(currentIndex / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage('');
    setEmail('');
    setSteps(0);
    setCurrentIndex(4);
  }

  function getNextIndexFromPrev(direction, prevIndex) {
    const col = prevIndex % 3;
    const row = Math.floor(prevIndex / 3);

    switch (direction) {
      case 'left':
        return col > 0 ? prevIndex - 1 : prevIndex;
      case 'right':
        return col < 2 ? prevIndex + 1 : prevIndex;
      case 'up':
        return row > 0 ? prevIndex - 3 : prevIndex;
      case 'down':
        return row < 2 ? prevIndex + 3 : prevIndex;
      default:
        return prevIndex; // Return the current index if the direction is invalid
    }
  }

  function move(evt) {
    const direction = evt.target.id;

    // Use functional state update to get the latest currentIndex
    setCurrentIndex(prevIndex => {
      const newIndex = getNextIndexFromPrev(direction, prevIndex); // Calculate the next index based on the previous index

      console.log(`Previous index: ${prevIndex}, Moving ${direction}, New index: ${newIndex}`);

      // If movement is valid (newIndex is different), update the state and steps
      if (newIndex !== prevIndex) {
        setSteps(prevSteps => prevSteps + 1); // Use functional state update for steps
        setMessage(''); // Clear any previous message
      } else {
        setMessage(`You can't go ${direction}`); // Show an error message if movement is invalid
      }

      return newIndex; // Return the new index to update the currentIndex
    });
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();

    if (!email) {
      setMessage('Ouch: email is required');
      return;
    }

    const { x, y } = getXY();
    const payload = { x, y, email, steps };

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setMessage(data.message);
      setEmail('');
    } catch (error) {
      setMessage('Error submitting data');
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : ''}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
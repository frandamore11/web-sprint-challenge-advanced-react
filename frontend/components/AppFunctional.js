import React, { useState, useEffect } from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at // why is initial index 4? 

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

   useEffect(() => {
    console.log(`Updated currentIndex: ${currentIndex}`);
  }, [currentIndex]);

  function getXY() {
    const x = (currentIndex % 3) + 1; //currentIndex = 1 
    const y = Math.floor(currentIndex / 3) + 1;
    console.log(`New coordinates: (${x}, ${y})`);
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setCurrentIndex(initialIndex);
  }

  function getNextIndex(direction) {
    const col = currentIndex % 3;
    const row = Math.floor(currentIndex / 3);
  
    let newIndex = currentIndex;
  
    switch (direction) {
      case 'left':
        if (col > 0) newIndex = currentIndex - 1;
        break;
      case 'right':
        if (col < 2) newIndex = currentIndex + 1;
        break;
      case 'up':
        if (row > 0) newIndex = currentIndex - 3;
        break;
      case 'down':
        if (row < 2) newIndex = currentIndex + 3;
        break;
      default:
        break;
    }
  
    // console.log(Direction: ${direction}, Current Index: ${currentIndex}, New Index: ${newIndex});
    return newIndex;
  }
  
  // console.log(getNextIndex('up'))


  function move(evt) {
    const direction = evt.target.id; // Get the direction (left, right, up, down)
    const newIndex = getNextIndex(direction); // Get the next index

    console.log(`Current index: ${currentIndex}, Moving ${direction}, New index: ${newIndex}`);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex); // Update the index
      setSteps(prevSteps => prevSteps + 1); // Increment the steps
      setMessage('')
    } else {

      setMessage(`You can't go ${direction}`); // Display a message if the move is invalid
    }

    return newIndex
    console.log(`Current active index after state update: ${currentIndex}`);
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  console.log(`Current index: ${currentIndex}`);

  async function onSubmit(evt) {
    evt.preventDefault();
  
    // Check if email is provided
    if (!email) {
      setMessage('Ouch: email is required');
      return;
    }

    const { x, y } = getXY();
  
    const payload = { x, y, email ,steps};
  
    try {
      // Making a POST request to the mock server API
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Parsing the API response
      const data = await response.json();
  
      // Update the message with the response message
      setMessage(data.message); // Assuming API sends { message: 'success or failure message' }
  
      // Clear email input after submission
      setEmail('');
  
    } catch (error) {
      // In case of a failure, set a generic error message
      setMessage('Error submitting data');
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">
          You moved {steps} {steps === 1 ? 'time' : 'times'}
        </h3>
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


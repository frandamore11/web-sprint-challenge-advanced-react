import React, { useState } from 'react'

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // "B" starts at index 4 in a 3x3 grid

export default function AppFunctional(props) {
  // States
  const [index, setIndex] = useState(initialIndex) // Index of "B" on the grid
  const [steps, setSteps] = useState(initialSteps) // Number of steps taken
  const [message, setMessage] = useState(initialMessage) // Message to display
  const [email, setEmail] = useState(initialEmail) // Email input

  // Helper to calculate the X, Y coordinates
  function getXY() {
    const x = (index % 3) + 1
    const y = Math.floor(index / 3) + 1
    return [x, y]
  }

  // Helper to return the "Coordinates (x, y)" message
  function getXYMessage() {
    const [x, y] = getXY()
    return `Coordinates (${x}, ${y})`
  }

  // Reset all states to their initial values
  function reset() {
    setIndex(initialIndex)
    setSteps(initialSteps)
    setMessage(initialMessage)
    setEmail(initialEmail)
  }

  // Calculate the next index based on direction
  function getNextIndex(direction) {
    const x = index % 3
    const y = Math.floor(index / 3)

    switch (direction) {
      case 'left':
        return x > 0 ? index - 1 : index
      case 'right':
        return x < 2 ? index + 1 : index
      case 'up':
        return y > 0 ? index - 3 : index
      case 'down':
        return y < 2 ? index + 3 : index
      default:
        return index
    }
  }

  // Move handler
  function move(evt) {
    const direction = evt.target.id // left, right, up, down
    const nextIndex = getNextIndex(direction)

    if (nextIndex !== index) {
      setIndex(nextIndex)
      setSteps(steps + 1)
      setMessage('')
    } else {
      setMessage("You can't go that way")
    }
  }

  // Handle input change for the email field
  function onChange(evt) {
    setEmail(evt.target.value)
  }

  // Handle form submission
  function onSubmit(evt) {
    evt.preventDefault()
    const payload = { email, steps }

    // For simplicity, using alert to simulate a POST request
    alert(`Submitting email: ${email} with steps: ${steps}`)
    // You could use axios or fetch here to submit the payload to the server
    // axios.post(`${BASE_URL}/submit`, payload)
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
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
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
  )
}
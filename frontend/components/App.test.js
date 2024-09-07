import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AppFunctional from './AppFunctional'

// Render the App and check if key elements are visible on the screen
test('renders headings and buttons correctly', () => {
  render(<AppFunctional />)
  
  // Check if the coordinates heading is rendered
  expect(screen.getByText(/coordinates/i)).toBeInTheDocument()
  
  // Check if the steps heading is rendered
  expect(screen.getByText(/You moved/i)).toBeInTheDocument()

  // Check if the direction buttons are rendered
  expect(screen.getByText(/left/i)).toBeInTheDocument()
  expect(screen.getByText(/right/i)).toBeInTheDocument()
  expect(screen.getByText(/up/i)).toBeInTheDocument()
  expect(screen.getByText(/down/i)).toBeInTheDocument()

  // Check if the reset button is rendered
  expect(screen.getByText(/reset/i)).toBeInTheDocument()
})

// Test that typing on the input results in its value changing
test('typing in the email input updates its value', () => {
  render(<AppFunctional />)

  // Get the email input field
  const emailInput = screen.getByPlaceholderText('type email')

  // Type into the input field
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

  // Assert the input field value is updated
  expect(emailInput.value).toBe('test@example.com')
})

// Test the initial state of the email input (should be empty)
test('email input should be empty initially', () => {
  render(<AppFunctional />)

  // Get the email input field
  const emailInput = screen.getByPlaceholderText('type email')

  // Assert the input field is initially empty
  expect(emailInput.value).toBe('')
})

// Test clicking the reset button clears the email input
test('reset button clears the email input value', () => {
  render(<AppFunctional />)

  // Get the email input field and the reset button
  const emailInput = screen.getByPlaceholderText('type email')
  const resetButton = screen.getByText(/reset/i)

  // Type into the email input
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

  // Assert the input value was updated
  expect(emailInput.value).toBe('test@example.com')

  // Click the reset button
  fireEvent.click(resetButton)

  // Assert the input field is cleared
  expect(emailInput.value).toBe('')
})

// Test the presence of the submit button
test('submit button is rendered on the screen', () => {
  render(<AppFunctional />)

  // Check if the submit button is rendered
  const submitButton = screen.getByText(/submit/i)

  // Assert the button is in the document
  expect(submitButton).toBeInTheDocument()
})
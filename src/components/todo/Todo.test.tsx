import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Todo from "./Todo";

afterEach(cleanup);

test('renders the todo component', () => {
  render(<Todo />);

  const todoTitleElement = screen.getByText(/Todo/i);
  const completedTitleElement = screen.getByText(/Completed/i);

  expect(todoTitleElement).toBeInTheDocument();
  expect(completedTitleElement).toBeInTheDocument();
});

test('renders the add task button and creates a new task on click', () => {
  render(<Todo />);

  const addTaskElement = screen.getByRole('button');

  fireEvent.click(addTaskElement);

  const datePickerElement = screen.getByPlaceholderText('Select date');
  // first element with plus icon is addTaskElement (declared beforehand)
  const [, addTaskIconButton] = screen.getAllByLabelText('plus');
  const editTaskIconButton = screen.getByLabelText('edit');

  expect(datePickerElement).toBeInTheDocument();
  expect(addTaskIconButton).toBeInTheDocument();
  expect(editTaskIconButton).toBeInTheDocument();
});

test('triggers loading from localStorage if it has a value on page load', () => {
  const TODO_SAMPLE = [{ key: '1', title: 'note-1', checked: false, expanded: true }];
  const COMPLETED_SAMPLE = [{ key: '2', title: 'note-2', checked: true, expanded: true }];

  window.localStorage.setItem('todo', JSON.stringify(TODO_SAMPLE));
  window.localStorage.setItem('completed', JSON.stringify(COMPLETED_SAMPLE));

  render(<Todo />);

  const todoTaskElement = screen.getByText('note-1');
  const completedTaskElement = screen.getByText('note-2');

  expect(todoTaskElement).toBeInTheDocument();
  expect(completedTaskElement).toBeInTheDocument();
});

test('trigger add subtask on icon click', () => {
  const TODO_SAMPLE = [{ key: '1', title: 'note-1', checked: false, expanded: true }];

  window.localStorage.setItem('todo', JSON.stringify(TODO_SAMPLE));

  render(<Todo />);

  // first element with plus icon is addTaskElement (declared beforehand)
  const [, todoTaskPlusIconButton] = screen.getAllByLabelText('plus');
  let addIconButtons = screen.getAllByLabelText('plus');

  expect(addIconButtons.length).toEqual(2);
  expect(todoTaskPlusIconButton).toBeInTheDocument();

  fireEvent.click(todoTaskPlusIconButton);

  addIconButtons = screen.getAllByLabelText('plus');

  // add icons must now be 3 because a subtask was added
  expect(addIconButtons.length).toEqual(3);
});

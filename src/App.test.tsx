import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test('renders the app title', () => {
  render(<App />);

  const appTitleElement = screen.getByText(/Multi-level To Do List/i);

  expect(appTitleElement).toBeInTheDocument();
});

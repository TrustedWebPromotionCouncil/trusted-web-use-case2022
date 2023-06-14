import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders learn react link', () => {
  render(<App />);
  const pageTitle = screen.getByText(/認証機関コンソール/i);
  expect(pageTitle).toBeInTheDocument();

  const listElements = screen.getAllByRole('listitem');
  expect(listElements).toHaveLength(4);

  expect(listElements[0].getAttribute('href'));
  // screen.debug();
});

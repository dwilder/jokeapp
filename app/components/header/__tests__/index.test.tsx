import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from '../index';

describe('Header', () => {
  it('renders the logo emoji', () => {
    render(<Header />);
    const logo = screen.getByText('🤡');
    expect(logo).toBeInTheDocument();
  });

  it('renders the site title', () => {
    render(<Header />);
    const title = screen.getByText('Tell Me a Joke');
    expect(title).toBeInTheDocument();
  });

  it('contains the language switcher', () => {
    render(<Header />);
    const languageSwitcher = screen.getByLabelText('Choose your language');
    expect(languageSwitcher).toBeInTheDocument();
  });
});
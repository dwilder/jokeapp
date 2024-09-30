import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Container from '../index';

describe('Container', () => {
  it('renders the container', () => {
    const { container } = render(<Container><p className="test">Test</p></Container>);
    expect(container).toBeInTheDocument();
  });

  it('renders it\'s children', () => {
    render(<Container><p className="test">Test</p></Container>);
    const p = screen.getByText('Test');
    expect(p).toBeInTheDocument();
  });
});
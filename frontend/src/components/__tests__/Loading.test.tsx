import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
  it('renders inline loading spinner by default', () => {
    render(<Loading />);
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loading-medium');
  });

  it('renders with custom text', () => {
    render(<Loading text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders small size when specified', () => {
    render(<Loading size="small" />);
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toHaveClass('loading-small');
  });

  it('renders large size when specified', () => {
    render(<Loading size="large" />);
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toHaveClass('loading-large');
  });

  it('renders fullscreen when fullScreen prop is true', () => {
    render(<Loading fullScreen />);
    const container = document.querySelector('.loading-fullscreen');
    expect(container).toBeInTheDocument();
  });

  it('does not render fullscreen when fullScreen prop is false', () => {
    render(<Loading fullScreen={false} />);
    const container = document.querySelector('.loading-fullscreen');
    expect(container).not.toBeInTheDocument();
  });
});

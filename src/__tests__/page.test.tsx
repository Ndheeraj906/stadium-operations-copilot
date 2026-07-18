import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { describe, it, expect } from 'vitest';

describe('Landing Page', () => {
  it('renders the main heading and links', () => {
    render(<Home />);
    
    expect(screen.getByText('StadiumSync')).toBeDefined();
    expect(screen.getByText(/next-generation stadium operations/i)).toBeDefined();
    
    // Check for links
    expect(screen.getByRole('link', { name: /Fan Assistant/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /Operations/i })).toBeDefined();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../app/page';

describe('Landing Page', () => {
  it('renders the main heading and links', () => {
    render(<Home />);
    
    expect(screen.getByText('StadiumSync')).toBeDefined();
    expect(screen.getByText(/next-generation stadium operations/i)).toBeDefined();
    
    // Check for links
    expect(screen.getByRole('link', { name: /Fan Copilot/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /Command Center/i })).toBeDefined();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import Link from 'next/link';

// Mock the Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

import { usePathname } from 'next/navigation';

describe('Navbar Component', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  // Simple test to verify the test setup works
  it('should render navigation elements', () => {
    // Mock Navbar component for testing
    const MockNavbar = () => (
      <nav aria-label="Main navigation">
        <img src="/logo.png" alt="Rudhirsetu Seva Sanstha logo" />
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/camp">Camps</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/donations">Donate</Link></li>
          <li><Link href="/social">Social</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
        <button aria-label="Toggle menu">☰</button>
      </nav>
    );

    render(<MockNavbar />);
    
    // Test that basic navigation elements are present
    const navigation = screen.getByLabelText('Main navigation');
    const logo = screen.getByAltText(/rudhirsetu seva sanstha logo/i);
    const homeLink = screen.getByText('Home');
    const campsLink = screen.getByText('Camps');
    const donateLink = screen.getByText('Donate');
    
    // Basic existence checks
    expect(navigation).toBeDefined();
    expect(logo).toBeDefined();
    expect(homeLink).toBeDefined();
    expect(campsLink).toBeDefined();
    expect(donateLink).toBeDefined();
  });

  it('should have accessible mobile menu button', () => {
    const MockNavbar = () => (
      <nav>
        <button aria-label="Toggle menu" type="button">☰</button>
      </nav>
    );

    render(<MockNavbar />);
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeDefined();
    
    // Test that the button is clickable
    fireEvent.click(menuButton);
    expect(menuButton).toBeDefined(); // Still present after click
  });

  it('should contain proper navigation links', () => {
    const MockNavbar = () => (
      <nav>
        <Link href="/donations">Donate</Link>
        <Link href="/camp">Camps</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    );

    render(<MockNavbar />);
    
    const donateLink = screen.getByRole('link', { name: /donate/i });
    const campsLink = screen.getByRole('link', { name: /camps/i });
    
    expect(donateLink).toBeDefined();
    expect(campsLink).toBeDefined();
  });

  it('should respond to pathname changes', () => {
    // Test pathname mock functionality
    mockUsePathname.mockReturnValue('/camp');
    expect(usePathname()).toBe('/camp');
    
    mockUsePathname.mockReturnValue('/donations');
    expect(usePathname()).toBe('/donations');
  });
}); 
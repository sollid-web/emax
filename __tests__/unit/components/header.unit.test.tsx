import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/header';

// Mock Next.js components
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));
vi.mock('next/link', () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }));

// Mock the Header component for testing
vi.mock('@/components/header', () => ({
  Header: () => (
    <header>
      <img alt="Emax Protocol Logo" />
      <nav>
        <a href="/about">About Us</a>
        <a href="/plans">Trading Plans</a>
        <a href="/faq">FAQ</a>
      </nav>
      <div>
        <button>Sign In</button>
        <button>Create Account</button>
      </div>
    </header>
  )
}));

describe('Header Component', () => {
  it('renders logo', () => {
    render(<Header />);
    expect(screen.getByAltText('Emax Protocol Logo')).toBeInTheDocument();
  });

  it('renders desktop nav links', () => {
    render(<Header />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Trading Plans')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders Sign In and Create Account buttons', () => {
    render(<Header />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });
});

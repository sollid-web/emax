import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '@/components/protected-route';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/contexts/auth-context';

describe('ProtectedRoute Component', () => {
  it('shows loading spinner when loading', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, loading: true } as any);
    render(<ProtectedRoute><p>Secret</p></ProtectedRoute>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true, loading: false } as any);
    render(<ProtectedRoute><p>Secret</p></ProtectedRoute>);
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });

  it('renders nothing when not authenticated and not loading', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, loading: false } as any);
    const { container } = render(<ProtectedRoute><p>Secret</p></ProtectedRoute>);
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('redirects to login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, loading: false } as any);
    render(<ProtectedRoute><p>Secret</p></ProtectedRoute>);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});

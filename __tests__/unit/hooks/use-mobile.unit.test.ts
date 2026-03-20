import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile hook', () => {
  const mockAddEventListener = vi.fn();
  const mockRemoveEventListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });
  });

  it('returns false when window width is >= 768', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true when window width is < 768', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('adds and removes event listener', () => {
    renderHook(() => useIsMobile());
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

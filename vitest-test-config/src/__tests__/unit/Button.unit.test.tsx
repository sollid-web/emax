import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';

// Inline Button component for demo — replace with your actual import
const Button = ({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button onClick={() => {}}>Submit</Button>);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does NOT call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Submit</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('does not call onClick when not interacted with', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    expect(onClick).not.toHaveBeenCalled();
  });
});

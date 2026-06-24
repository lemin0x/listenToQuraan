import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeedControl } from './SpeedControl';
import { usePlayerStore } from '@/stores/playerStore';

describe('SpeedControl', () => {
  beforeEach(() => {
    usePlayerStore.setState({ playbackRate: 1 });
  });

  it('renders all speed options', () => {
    render(<SpeedControl />);
    expect(screen.getByLabelText('0.5x speed')).toBeInTheDocument();
    expect(screen.getByLabelText('0.75x speed')).toBeInTheDocument();
    expect(screen.getByLabelText('1x speed')).toBeInTheDocument();
    expect(screen.getByLabelText('1.25x speed')).toBeInTheDocument();
    expect(screen.getByLabelText('1.5x speed')).toBeInTheDocument();
    expect(screen.getByLabelText('2x speed')).toBeInTheDocument();
  });

  it('highlights the current speed', () => {
    usePlayerStore.setState({ playbackRate: 1.5 });
    render(<SpeedControl />);
    const button = screen.getByLabelText('1.5x speed');
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('changes speed on click', async () => {
    const user = userEvent.setup();
    render(<SpeedControl />);
    await user.click(screen.getByLabelText('2x speed'));
    expect(usePlayerStore.getState().playbackRate).toBe(2);
  });

  it('has correct aria role', () => {
    render(<SpeedControl />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore } from '@/stores/playerStore';

describe('ProgressBar', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentTime: 0,
      duration: 200,
      pointA: null,
      pointB: null,
    });
  });

  it('renders with correct aria attributes', () => {
    render(<ProgressBar onSeek={() => {}} />);
    const slider = screen.getByRole('slider', { name: 'Audio progress' });
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '200');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
    expect(slider).toHaveAttribute('aria-valuetext');
    expect(slider).toHaveAttribute('tabindex', '0');
  });

  it('displays current time and duration', () => {
    render(<ProgressBar onSeek={() => {}} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
    expect(screen.getByText('3:20')).toBeInTheDocument();
  });

  it('calls onSeek when clicked', async () => {
    const onSeek = vi.fn();
    const user = userEvent.setup();
    render(<ProgressBar onSeek={onSeek} />);
    const slider = screen.getByRole('slider');
    const rect = slider.getBoundingClientRect();
    await user.click(slider);
    expect(onSeek).toHaveBeenCalled();
  });

  it('hides markers when showMarkers is false', () => {
    usePlayerStore.setState({ pointA: 50, pointB: 100 });
    const { container } = render(<ProgressBar onSeek={() => {}} showMarkers={false} />);
    const markers = container.querySelectorAll('.bg-highlight, .bg-danger');
    expect(markers.length).toBe(0);
  });

  it('shows markers when showMarkers is true', () => {
    usePlayerStore.setState({ pointA: 50, pointB: 100 });
    const { container } = render(<ProgressBar onSeek={() => {}} />);
    const markers = container.querySelectorAll('.bg-highlight, .bg-danger');
    expect(markers.length).toBe(2);
  });
});

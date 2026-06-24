import { describe, it, expect, beforeEach } from 'vitest';
import { useSegmentsStore } from './segmentsStore';

describe('segmentsStore', () => {
  beforeEach(() => {
    useSegmentsStore.setState({ segments: [] });
  });

  it('starts with empty segments', () => {
    expect(useSegmentsStore.getState().segments).toEqual([]);
  });

  it('adds a segment', () => {
    useSegmentsStore.getState().addSegment({
      recordingId: 'rec-1',
      surahId: 1,
      surahName: 'Al-Fatiha',
      label: 'Segment 1',
      pointA: 10,
      pointB: 20,
    });
    const segments = useSegmentsStore.getState().segments;
    expect(segments).toHaveLength(1);
    expect(segments[0].recordingId).toBe('rec-1');
    expect(segments[0].pointA).toBe(10);
    expect(segments[0].pointB).toBe(20);
    expect(segments[0].id).toBeDefined();
    expect(segments[0].createdAt).toBeDefined();
  });

  it('removes a segment by id', () => {
    useSegmentsStore.getState().addSegment({
      recordingId: 'rec-1', surahId: 1, surahName: 'Test',
      label: 'Seg 1', pointA: 10, pointB: 20,
    });
    const id = useSegmentsStore.getState().segments[0].id;
    useSegmentsStore.getState().removeSegment(id);
    expect(useSegmentsStore.getState().segments).toHaveLength(0);
  });

  it('filters segments by recording id', () => {
    useSegmentsStore.getState().addSegment({
      recordingId: 'rec-1', surahId: 1, surahName: 'Test',
      label: 'Seg 1', pointA: 10, pointB: 20,
    });
    useSegmentsStore.getState().addSegment({
      recordingId: 'rec-2', surahId: 2, surahName: 'Test 2',
      label: 'Seg 2', pointA: 30, pointB: 40,
    });
    useSegmentsStore.getState().addSegment({
      recordingId: 'rec-1', surahId: 1, surahName: 'Test',
      label: 'Seg 3', pointA: 50, pointB: 60,
    });
    const filtered = useSegmentsStore.getState().getSegmentsForRecording('rec-1');
    expect(filtered).toHaveLength(2);
  });

  it('removing non-existent id does nothing', () => {
    useSegmentsStore.getState().addSegment({
      recordingId: 'rec-1', surahId: 1, surahName: 'Test',
      label: 'Seg 1', pointA: 10, pointB: 20,
    });
    useSegmentsStore.getState().removeSegment('nonexistent');
    expect(useSegmentsStore.getState().segments).toHaveLength(1);
  });
});

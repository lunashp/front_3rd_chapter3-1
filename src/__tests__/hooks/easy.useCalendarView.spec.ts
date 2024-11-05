import { act, renderHook } from '@testing-library/react';

import { useCalendarView } from '../../hooks/useCalendarView.ts';
import { assertDate } from '../utils.ts';

describe('초기 상태', () => {
  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());

    expect(result.current.view).toBe('month');
  });

  it('currentDate는 오늘 날짜인 "2024-10-01"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    // const date = result.current.currentDate;
    // const formatDate = date.toISOString().split('T')[0];
    // expect(formatDate).toBe('2024-10-01');
    const expectedDate = new Date('2024-10-01');

    assertDate(result.current.currentDate, expectedDate);
  });

  it('holidays는 10월 휴일인 개천절, 한글날이 지정되어 있어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    const holidayValues = Object.values(result.current.holidays);

    expect(holidayValues).toEqual(['개천절', '한글날']);
  });
});

it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('week');
  });

  expect(result.current.view).toBe('week');
});

it("주간 뷰에서 다음으로 navigate시 7일 후 '2024-10-08' 날짜로 지정이 된다", () => {
  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('week');
  });

  act(() => {
    result.current.navigate('next');
  });

  const expectedDate = new Date('2024-10-08');

  assertDate(result.current.currentDate, expectedDate);
});

it("주간 뷰에서 이전으로 navigate시 7일 후 '2024-09-24' 날짜로 지정이 된다", () => {
  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('week');
  });

  act(() => {
    result.current.navigate('prev');
  });

  const expectedDate = new Date('2024-09-24');

  assertDate(result.current.currentDate, expectedDate);
});

it("월간 뷰에서 다음으로 navigate시 한 달 후 '2024-11-01' 날짜여야 한다", () => {
  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('month');
  });

  act(() => {
    result.current.navigate('next');
  });

  const expectedDate = new Date('2024-11-01');

  assertDate(result.current.currentDate, expectedDate);
});

it("월간 뷰에서 이전으로 navigate시 한 달 전 '2024-09-01' 날짜여야 한다", () => {
  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('month');
  });

  act(() => {
    result.current.navigate('prev');
  });

  const expectedDate = new Date('2024-09-01');

  assertDate(result.current.currentDate, expectedDate);
});

it("currentDate가 '2024-01-01' 변경되면 1월 휴일 '신정'으로 업데이트되어야 한다", async () => {
  const { result } = renderHook(() => useCalendarView());
  const changeDate = new Date('2024-01-01');

  act(() => {
    result.current.setCurrentDate(changeDate);
  });

  const holidayValues = Object.values(result.current.holidays);

  expect(holidayValues).toEqual(['신정']);
});

import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const events: Event[] = [
  {
    id: '1',
    title: '회의',
    date: '2024-10-04',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '운동',
    date: '2024-10-16',
    startTime: '13:00',
    endTime: '17:00',
    description: '필라테스',
    location: '영등포',
    category: '취미',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '점심',
    date: '2024-10-24',
    startTime: '13:00',
    endTime: '18:00',
    description: '집들이',
    location: '봉천',
    category: '식사',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '4',
    title: '운동',
    date: '2024-11-11',
    startTime: '13:00',
    endTime: '17:00',
    description: '필라테스',
    location: '압구정',
    category: '취미',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

let currentDate = new Date('2024-10-01');

beforeEach(() => {
  currentDate = new Date('2024-10-01');
});

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

  expect(result.current.filteredEvents).toEqual([
    {
      id: '1',
      title: '회의',
      date: '2024-10-04',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '운동',
      date: '2024-10-16',
      startTime: '13:00',
      endTime: '17:00',
      description: '필라테스',
      location: '영등포',
      category: '취미',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '점심',
      date: '2024-10-24',
      startTime: '13:00',
      endTime: '18:00',
      description: '집들이',
      location: '봉천',
      category: '식사',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual([
    {
      id: '1',
      title: '회의',
      date: '2024-10-04',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

  act(() => {
    result.current.setSearchTerm('운동');
  });

  expect(result.current.filteredEvents).toEqual([
    {
      id: '2',
      title: '운동',
      date: '2024-10-16',
      startTime: '13:00',
      endTime: '17:00',
      description: '필라테스',
      location: '영등포',
      category: '취미',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
});

describe('검색어가 있을 때 현재 뷰(주간/월간)에 해당하는 이벤트를 반환해야 한다', () => {
  it('현재 주간에 해당하는 검색 이벤트만 반환해야 한다', () => {
    const view = 'week';
    const { result } = renderHook(() => useSearch(events, currentDate, view));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toEqual([
      {
        id: '1',
        title: '회의',
        date: '2024-10-04',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('현재 월간에 해당하는 검색 이벤트만 반환해야 한다', () => {
    const view = 'month';
    const { result } = renderHook(() => useSearch(events, currentDate, view));

    act(() => {
      result.current.setSearchTerm('운동');
    });

    expect(result.current.filteredEvents).toEqual([
      {
        id: '2',
        title: '운동',
        date: '2024-10-16',
        startTime: '13:00',
        endTime: '17:00',
        description: '필라테스',
        location: '영등포',
        category: '취미',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual([
    {
      id: '1',
      title: '회의',
      date: '2024-10-04',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents).toEqual([
    {
      id: '3',
      title: '점심',
      date: '2024-10-24',
      startTime: '13:00',
      endTime: '18:00',
      description: '집들이',
      location: '봉천',
      category: '식사',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
});

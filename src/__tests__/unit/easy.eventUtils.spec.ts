import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

const events: Event[] = [
  {
    id: '1',
    title: '이벤트 1',
    date: '2024-07-01',
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
    title: '이벤트 2',
    date: '2024-07-02',
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
    title: '이벤트 3',
    date: '2024-07-20',
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
    title: 'Event 4',
    date: '2024-07-31',
    startTime: '13:00',
    endTime: '14:00',
    description: '점심',
    location: '남양주',
    category: '식사',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(events, '이벤트 2', new Date('2024-07-02'), 'month');
    expect(result).toEqual([
      {
        id: '2',
        title: '이벤트 2',
        date: '2024-07-02',
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

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2024-07-01'), 'week');
    expect(result).toEqual([
      {
        id: '1',
        title: '이벤트 1',
        date: '2024-07-01',
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
        title: '이벤트 2',
        date: '2024-07-02',
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

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
    expect(result).toEqual([
      {
        id: '1',
        title: '이벤트 1',
        date: '2024-07-01',
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
        title: '이벤트 2',
        date: '2024-07-02',
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
        title: '이벤트 3',
        date: '2024-07-20',
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
        title: 'Event 4',
        date: '2024-07-31',
        startTime: '13:00',
        endTime: '14:00',
        description: '점심',
        location: '남양주',
        category: '식사',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(events, '이벤트', new Date('2024-07-01'), 'week');
    expect(result).toEqual([
      {
        id: '1',
        title: '이벤트 1',
        date: '2024-07-01',
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
        title: '이벤트 2',
        date: '2024-07-02',
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

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
    expect(result).toEqual(events);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const result = getFilteredEvents(
      events,
      'event'.toUpperCase(),
      new Date('2024-07-01'),
      'month'
    );
    expect(result).toEqual([
      {
        id: '4',
        title: 'Event 4',
        date: '2024-07-31',
        startTime: '13:00',
        endTime: '14:00',
        description: '점심',
        location: '남양주',
        category: '식사',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  // 위에서 검증해서 주석 처리
  //('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {});

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '이벤트', new Date('2024-07-01'), 'month');
    expect(result).toEqual([]);
  });
});

import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

const event: Event = {
  id: '1',
  title: '회의',
  date: '2024-10-01',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const event2: Event = {
  id: '2',
  title: '점심',
  date: '2024-10-02',
  startTime: '13:00',
  endTime: '14:00',
  description: '육회비빔밥',
  location: '시청',
  category: '식사',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const events = [event, event2];

const event3: Event = {
  id: '1',
  title: '점심',
  date: '2024-10-02',
  startTime: '13:00',
  endTime: '14:00',
  description: '월남쌈',
  location: '남양주',
  category: '식사',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const event4: Event = {
  id: '1',
  title: '운동',
  date: '2024-10-15',
  startTime: '13:00',
  endTime: '17:00',
  description: '필라테스',
  location: '영등포',
  category: '취미',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const falseDateEvent: Event = {
  id: '1',
  title: '회의',
  date: '2024-99-99',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const falseTimeEvent: Event = {
  id: '1',
  title: '회의',
  date: '2024-10-01',
  startTime: '99:00',
  endTime: '99:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2024-07-01', '14:30')).toEqual(new Date(`2024-07-01T14:30`));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-99-99', '14:30')).toEqual(new Date('Invalid Date'));
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-11-07', '99:99')).toEqual(new Date('Invalid Date'));
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(parseDateTime('', '99:99')).toEqual(new Date('Invalid Date'));
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const result = convertEventToDateRange(event);
    const expected = {
      start: new Date('2024-10-01T09:00'),
      end: new Date('2024-10-01T10:00'),
    };
    expect(result).toEqual(expected);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const result = convertEventToDateRange(falseDateEvent);
    const expected = { start: new Date('Invalid Date'), end: new Date('Invalid Date') };
    expect(result).toEqual(expected);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const result = convertEventToDateRange(falseTimeEvent);
    const expected = { start: new Date('Invalid Date'), end: new Date('Invalid Date') };
    expect(result).toEqual(expected);
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(event2, event3)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    expect(isOverlapping(event, event3)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const result = findOverlappingEvents(event3, events);
    expect(result).toEqual([
      {
        id: '2',
        title: '점심',
        date: '2024-10-02',
        startTime: '13:00',
        endTime: '14:00',
        description: '육회비빔밥',
        location: '시청',
        category: '식사',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const result = findOverlappingEvents(event4, events);
    expect(result).toEqual([]);
  });
});

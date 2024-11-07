import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

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
];

const event: Event = {
  id: '1',
  title: '운동',
  date: '2024-10-16',
  startTime: '13:00',
  endTime: '17:00',
  description: '필라테스',
  location: '영등포',
  category: '취미',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    // notificationTime이 10이기 때문에 10분 전으로 설정
    const result = getUpcomingEvents(events, new Date(`2024-10-04T08:50`), []);
    expect(result).toEqual([
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

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(events, new Date(`2024-10-04T09:00`), notifiedEvents);
    expect(result).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const result = getUpcomingEvents(events, new Date(`2024-10-04T08:00`), []);
    expect(result).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const result = getUpcomingEvents(events, new Date(`2024-10-04T10:00`), []);
    expect(result).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const result = createNotificationMessage(event);
    expect(result).toBe(`10분 후 운동 일정이 시작됩니다.`);
  });
});

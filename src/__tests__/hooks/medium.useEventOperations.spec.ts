import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { events } from '../../__mocks__/response/events.json' assert { type: 'json' };
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';

// ? Medium: 아래 toastFn과 mock과 이 fn은 무엇을 해줄까요?
// useToast 훅을 모킹하여, 실제 알림을 표시하는 대신 호출된 내용을 추적하고 검증
// useEventOperations에 있는 toast값 출력

const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  setupMockHandlerCreation(events as Event[]);

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() =>
    expect(result.current.events).toEqual([
      {
        id: '1',
        title: '기존 회의',
        date: '2024-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ])
  );
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  setupMockHandlerCreation(events as Event[]);

  const { result } = renderHook(() => useEventOperations(false));

  const newEvent = {
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
  };

  await act(() => {
    result.current.saveEvent(newEvent as Event);
  });

  expect(toastFn).toHaveBeenCalledWith({
    title: '일정이 추가되었습니다.',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });

  expect(result.current.events).toEqual([
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
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
  ]);
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
  setupMockHandlerUpdating();
  const { result } = renderHook(() => useEventOperations(true));

  const updatedEvent = {
    id: '1',
    title: '업데이트된 회의',
    date: '2024-10-04',
    startTime: '09:00',
    endTime: '10:30',
  };

  await act(async () => {
    await result.current.saveEvent(updatedEvent as Event);
  });

  expect(toastFn).toHaveBeenCalledWith({
    title: '일정이 수정되었습니다.',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });

  expect(result.current.events).toEqual([
    {
      id: '1',
      title: '업데이트된 회의',
      date: '2024-10-04',
      startTime: '09:00',
      endTime: '10:30',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2024-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무 회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
  ]);
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  setupMockHandlerDeletion();

  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  expect(toastFn).toHaveBeenCalledWith({
    title: '일정이 삭제되었습니다.',
    status: 'info',
    duration: 3000,
    isClosable: true,
  });
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(
    http.get('/api/events', () => {
      return HttpResponse.error();
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.fetchEvents();
  });

  await waitFor(() =>
    expect(toastFn).toHaveBeenCalledWith({
      title: '이벤트 로딩 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
  );
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  server.use(
    http.put('/api/events/:id', () => {
      return HttpResponse.error();
    })
  );

  const { result } = renderHook(() => useEventOperations(true));

  const nonExistentEvent = {
    id: '999',
    title: '존재하지 않는 회의',
    date: '2024-10-04',
    startTime: '09:00',
    endTime: '10:00',
  };

  await act(async () => {
    await result.current.saveEvent(nonExistentEvent as Event);
  });

  expect(toastFn).toHaveBeenCalledWith({
    title: '일정 저장 실패',
    status: 'error',
    duration: 3000,
    isClosable: true,
  });
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  server.use(
    http.delete('/api/events/:id', () => {
      return HttpResponse.error();
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  expect(toastFn).toHaveBeenCalledWith({
    title: '일정 삭제 실패',
    status: 'error',
    duration: 3000,
    isClosable: true,
  });
});

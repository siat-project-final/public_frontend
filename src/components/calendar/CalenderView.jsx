import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import instance from '../../api/axios';
import { getMyStudyLogs } from '../../api/studyLog';
import { getSchedules, addSchedule, updateSchedule, deleteSchedule } from '../../api/schedule';
import Header from '../common/Header';
import Todo from '../common/Todo';
import CalendarModal from './CalendarModal';
import CalendarDetailModal from './CalendarDetailModal';
import CalendarEditModal from './CalendarEditModal';
import FooterBag from './FooterBag';

const stickerKey = (memberId) => `calendarSticker_${memberId}`; // ⭐ 추가

const loadStickerEvents = (memberId) => {
  // ⭐ 추가
  try {
    return JSON.parse(localStorage.getItem(stickerKey(memberId)) || '[]');
  } catch {
    return [];
  }
};

const saveStickerEvents = (memberId, events) => {
  // ⭐ 추가
  localStorage.setItem(stickerKey(memberId), JSON.stringify(events));
};

const CalendarView = () => {
  const calendarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [serverEvents, setServerEvents] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonthStr, setCurrentMonthStr] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    return sessionStorage.getItem('selectedDate') || getTodayString();
  });
  const [selectionInfo, setSelectionInfo] = useState(null);
  const [localTodoTrigger, setLocalTodoTrigger] = useState(Date.now());

  const memberId = localStorage.getItem('memberId');
  const [writtenDates, setWrittenDates] = useState(null);
  const [stickerEvents, setStickerEvents] = useState(() =>
    // ⭐ 추가
    loadStickerEvents(memberId)
  );

  const SUBJECT_COLORS = {
    Python: '#85C1E9',
    Java: '#F7DC6F',
    JavaScript: '#F5B041',
    C: '#A9DFBF',
    기타: '#D7DBDD',
  };

  const clickTimer = useRef(null);

  function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  const fetchWrittenLogs = async () => {
    try {
      const res = await getMyStudyLogs(memberId);
      const dates = new Set(res.data.map((log) => log.studyDate?.split('T')[0]).filter(Boolean));
      setWrittenDates(dates);
    } catch (err) {
      console.error('작성된 학습일지 불러오기 실패:', err);
    }
  };

  function groupContinuousDates(dates) {
    const sorted = [...dates].sort();
    const groups = [];
    let groupStart = sorted[0];
    let prev = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const prevDate = new Date(prev);
      prevDate.setDate(prevDate.getDate() + 1);
      const expected = prevDate.toISOString().split('T')[0];

      if (current !== expected) {
        groups.push([groupStart, prev]);
        groupStart = current;
      }
      prev = current;
    }

    groups.push([groupStart, prev]);
    return groups;
  }

  const convertJsonToCalendarEvents = (jsonData, writtenDatesSet) => {
    const events = [];
    const stickerDateSet = new Set();

    const subjectDateMap = new Map(); // 📌 과목별 날짜 누적용

    Object.entries(jsonData).forEach(
      ([
        date,
        { subjectList, studyDiaryList, mentoringList, mentoringReservationList, sticker },
      ]) => {
        const normalizedDate = date.split('T')[0];

        // 스티커
        if (sticker && !stickerDateSet.has(normalizedDate)) {
          events.push({
            title: '',
            start: date,
            end: date,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            textColor: 'transparent',
            extendedProps: { type: 'STICKER', image: sticker },
          });
          stickerDateSet.add(normalizedDate);
        }

        // 📌 과목별 날짜 누적
        subjectList?.forEach((subject) => {
          if (!subjectDateMap.has(subject)) subjectDateMap.set(subject, []);
          subjectDateMap.get(subject).push(normalizedDate);
        });

        // 학습일지
        if (studyDiaryList?.length > 0) {
          studyDiaryList.forEach((diary) => {
            events.push({
              title: `[일지] ${diary.title || '학습일지'}`,
              start: date,
              end: date,
              backgroundColor: '#ABEBC6',
              borderColor: '#ABEBC6',
              textColor: '#000',
              extendedProps: { type: 'DIARY', ...diary },
            });
          });
        } else if (subjectList?.length > 0 && !writtenDatesSet?.has(normalizedDate)) {
          events.push({
            title: `학습일지 미작성`,
            start: date,
            end: date,
            backgroundColor: '#F1948A',
            borderColor: '#F1948A',
            textColor: '#000',
            extendedProps: { type: 'UNWRITTEN_DIARY', date },
          });
        }

        // 멘토링
        mentoringList?.forEach((m) => {
          events.push({
            title: `[멘토링] ${m.mentorName}`,
            start: date,
            end: date,
            backgroundColor: '#F1C40F',
            borderColor: '#F1C40F',
            textColor: '#000',
            extendedProps: { type: 'MENTORING', ...m },
          });
        });

        mentoringReservationList?.forEach((r) => {
          events.push({
            title: `[멘토링 예약] ${r.mentorName}`,
            start: date,
            end: date,
            backgroundColor: '#F9E79F',
            borderColor: '#F9E79F',
            textColor: '#000',
            extendedProps: { type: 'MENTORING', ...r },
          });
        });
      }
    );

    // 연속된 날짜 묶어서 과목 이벤트로 생성
    subjectDateMap.forEach((dates, subject) => {
      const color = SUBJECT_COLORS[subject] || SUBJECT_COLORS['기타'];
      const groupedRanges = groupContinuousDates(dates);

      groupedRanges.forEach(([start, end]) => {
        const endDate = new Date(end);
        endDate.setDate(endDate.getDate() + 1); // FullCalendar는 end exclusive
        const endStr = endDate.toISOString().split('T')[0];

        events.push({
          title: subject,
          start: start,
          end: endStr,
          backgroundColor: color,
          borderColor: color,
          textColor: '#000',
          extendedProps: { type: 'SUBJECT', subject },
        });
      });
    });

    return events;
  };

  const fetchCalendarData = async (monthStr, writtenDatesSet) => {
    try {
      if (!memberId) return;
      const res = await instance.get(`/calendar/schedule/${memberId}/${monthStr}`);
      const calendarMapped = convertJsonToCalendarEvents(res.data, writtenDatesSet);
      setServerEvents(calendarMapped);
    } catch (error) {
      console.error('캘린더 데이터 조회 실패:', error);
    }
  };

  const fetchScheduleData = async (monthStr) => {
    try {
      if (!memberId) return;
      const [year, month] = monthStr.split('-');
      const startDate = `${monthStr}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${monthStr}-${lastDay}`;
      const res = await getSchedules(memberId, startDate, endDate);
      const scheduleEvents = res.data.map((schedule) => ({
        id: schedule.scheduleId,
        title: schedule.title,
        start: schedule.startDatetime,
        end: schedule.endDatetime,
        allDay: schedule.isAllDay,
        backgroundColor: schedule.colorCode || '#BAFFC9',
        borderColor: schedule.colorCode || '#BAFFC9',
        textColor: '#000',
        extendedProps: {
          type: 'SCHEDULE',
          content: schedule.content,
          scheduleId: schedule.scheduleId,
        },
      }));
      setScheduleEvents(scheduleEvents);
    } catch (error) {
      console.error('일정 데이터 조회 실패:', error);
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      const scheduleData = {
        memberId: parseInt(memberId),
        title: eventData.title,
        content: eventData.extendedProps?.content || '',
        startDatetime: eventData.start,
        endDatetime: eventData.end,
        isAllDay: eventData.allDay,
        colorCode: eventData.backgroundColor,
      };

      const res = await addSchedule(scheduleData);
      const calendarApi = calendarRef.current?.getApi();
      const currentDate = calendarApi ? calendarApi.getDate() : new Date();
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const monthStr = `${yyyy}-${mm}`;

      await fetchScheduleData(monthStr);

      setIsModalOpen(false);
    } catch (error) {
      console.error('일정 추가 실패:', error);
      alert('일정 추가에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchWrittenLogs();
  }, [memberId]);

  useEffect(() => {
    if (writtenDates !== null) {
      const calendarApi = calendarRef.current?.getApi();
      const currentDate = calendarApi ? calendarApi.getDate() : new Date();
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const monthStr = `${yyyy}-${mm}`;
      fetchCalendarData(monthStr, writtenDates);
      fetchScheduleData(monthStr);
    }
  }, [writtenDates]);

  const handleEventClick = (clickInfo) => {
    const { type } = clickInfo.event.extendedProps;
    if (type === 'SCHEDULE') {
      setSelectedEvent(clickInfo.event);
      setIsDetailModalOpen(true);
    } else if (type === 'DIARY') {
      navigate(`/study-log/${clickInfo.event.extendedProps.diaryId}`);
    } else if (type === 'UNWRITTEN_DIARY') {
      navigate(`/study/write?date=${clickInfo.event.extendedProps.date}`);
    } else if (type === 'MENTORING') {
      // alert(`멘토링: ${clickInfo.event.title}`);
    } else if (type === 'STICKER') {
      if (window.confirm('스티커를 삭제할까요?')) {
        // 화면에서 삭제
        clickInfo.event.remove();

        // localStorage 갱신
        setStickerEvents((prev) => {
          const next = prev.filter((e) => e.id !== clickInfo.event.id);
          saveStickerEvents(memberId, next);
          return next;
        });
      }
    }
  };

  const handleDateClick = (arg) => {
    const dateStr = arg.dateStr;
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setSelectionInfo({ start: dateStr, end: dateStr });
      setIsModalOpen(true);
    } else {
      clickTimer.current = setTimeout(() => {
        setSelectedDate(dateStr);
        clickTimer.current = null;
      }, 250);
    }
  };

  const handleEventReceive = (info) => {
    // ⭐ 수정
    const calendarApi = calendarRef.current.getApi();
    const droppedDate = info.event.startStr;
    const { stickerId, image, align = 'center', position = 'bottom' } = info.event.extendedProps;

    const eventId = `sticker-${stickerId}-${droppedDate}`;
    if (calendarApi.getEventById(eventId)) {
      info.revert();
      return;
    }

    // 새 스티커 이벤트 객체
    const newSticker = {
      id: eventId,
      title: '',
      start: droppedDate,
      allDay: true,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: 'transparent',
      extendedProps: { type: 'STICKER', stickerId, image, align, position },
    };

    // ① 화면에 추가
    calendarApi.addEvent(newSticker);

    // ② localStorage에 영구 저장
    setStickerEvents((prev) => {
      const next = [...prev, newSticker];
      saveStickerEvents(memberId, next);
      return next;
    });

    // ③ 드래그 원본 제거
    info.event.remove();
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const scheduleId = selectedEvent.extendedProps.scheduleId;
        await deleteSchedule(scheduleId);
        const calendarApi = calendarRef.current?.getApi();
        const currentDate = calendarApi ? calendarApi.getDate() : new Date();
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const monthStr = `${yyyy}-${mm}`;
        await fetchScheduleData(monthStr);
        handleCloseDetailModal();
      } catch (error) {
        console.error('일정 삭제 실패:', error);
        alert('일정 삭제에 실패했습니다.');
      }
    }
  };

  const handleSaveEdit = async (updatedEventData) => {
    try {
      const scheduleId = Number(selectedEvent.extendedProps.scheduleId);
      if (!scheduleId) {
        alert('일정 ID가 없습니다.');
        return;
      }

      const updateData = {
        title: updatedEventData.title,
        content: updatedEventData.extendedProps?.content || '',
        startDatetime: updatedEventData.start,
        endDatetime: updatedEventData.end,
        isAllDay: updatedEventData.allDay,
        colorCode: updatedEventData.backgroundColor,
      };

      await updateSchedule(scheduleId, updateData);
      const calendarApi = calendarRef.current?.getApi();
      const currentDate = calendarApi ? calendarApi.getDate() : new Date();
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const monthStr = `${yyyy}-${mm}`;
      await fetchScheduleData(monthStr);
      handleCloseEditModal();
    } catch (error) {
      console.error('일정 수정 실패:', error);
      alert('일정 수정에 실패했습니다.');
    }
  };

  const eventPriority = (event) => {
    const type = event.extendedProps?.type;
    if (type === 'SUBJECT') return 1;
    if (type === 'MENTORING') return 2;
    if (type === 'UNWRITTEN_DIARY') return 3;
    if (type === 'SCHEDULE') return 4;
    return 99;
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <style>
            {`
            
            .fc .fc-daygrid-day {
              height: auto !important;
              padding: 0 !important;
            }
            .fc .fc-daygrid-day-frame {
              height: auto !important;
              min-height: 130px !important;
              max-height: none !important;
              position: relative !important;
              padding: 4px !important;
            }
            .fc .fc-scrollgrid-sync-table {
              height: auto !important;
            }

            /* 툴바 */
            .fc .fc-toolbar {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              margin-bottom: 16px !important;
              position: relative !important;
              height: 60px !important;
            }


            .fc .fc-toolbar-title {
              font-size: 24px !important;
              font-weight: bold !important;
              position: absolute !important;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              max-width: none !important;
              padding: 0 16px !important;
              white-space: nowrap !important;
              overflow: visible !important;
              text-overflow: unset !important;
              text-align: center !important;
            }

            /* 커스텀 내비게이션 버튼 */
            .fc-myPrev-button,
            .fc-myNext-button {
              background: none !important;
              border: none !important;
              width: 24px !important;
              height: 32px !important;
              cursor: pointer !important;
              position: absolute !important;
              top: 52% !important;
              transform: translateY(-50%) !important;
              z-index: 1 !important;
              outline: none !important;
              box-shadow: none !important;
            }

            .fc-myPrev-button {
              left: calc(50% - 250px) !important;
            }

            .fc-myNext-button {
              right: calc(50% - 250px) !important;
            }

            .fc-myPrev-button::before,
            .fc-myNext-button::before {
              content: '' !important;
              position: absolute !important;
              top: 52% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) !important;
              width: 24px !important;
              height: 24px !important;
              background-size: contain !important;
              background-repeat: no-repeat !important;
            }

            .fc-myPrev-button::before {
              background-image: url('/assets/img/mentors/chevron-left.png') !important;
            }

            .fc-myNext-button::before {
              background-image: url('/assets/img/mentors/chevron-right.png') !important;
            }

            /*  오늘 버튼 스타일 */
            .fc-today-button {
              margin-right: 400px !important;
              background-color: #84cc16 !important;
              border-color: #84cc16 !important;
              color: white !important;
            }

            /* 6번째 줄 강제 제거 */
            .fc-daygrid-body tr:nth-child(6) {
              display: none;
            }
              .selected-cell {
              background-color: #e9ecef !important;
              transition: background-color 0.3s ease;
            }
          `}
          </style>

          <FullCalendar
            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
              resourceTimelinePlugin,
            ]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={{
              left: 'myPrev',
              center: 'title',
              right: 'myNext today',
            }}
            customButtons={{
              myPrev: { text: '', click: () => calendarRef.current?.getApi().prev() },
              myNext: { text: '', click: () => calendarRef.current?.getApi().next() },
              today: { text: '오늘', click: () => calendarRef.current?.getApi().today() },
            }}
            events={[...serverEvents, ...scheduleEvents, ...stickerEvents].sort((a, b) => {
              const getPriority = (ev) => (ev.extendedProps?.type === 'STICKER' ? 99 : 0);
              return getPriority(a) - getPriority(b);
            })}
            eventContent={(arg) => {
              const { type, image } = arg.event.extendedProps;
              if (type === 'STICKER' && image) {
                // 날짜 셀 내 여러 스티커가 겹치지 않게 left 오프셋 계산
                // 같은 날짜의 스티커 개수와 인덱스를 구함
                const allEvents = arg.view.calendar.getEvents();
                const sameDayStickers = allEvents.filter(
                  (ev) => ev.extendedProps?.type === 'STICKER' && ev.startStr === arg.event.startStr
                );
                const myIdx = sameDayStickers.findIndex((ev) => ev.id === arg.event.id);
                const total = sameDayStickers.length;
                // -20, 0, +20 등으로 분산 (최대 5개까지)
                const offset = (myIdx - (total - 1) / 2) * 44;

                const wrapper = document.createElement('div');
                wrapper.style.position = 'absolute';
                wrapper.style.left = `calc(50% + ${offset}px)`;
                wrapper.style.bottom = '4px';
                wrapper.style.transform = 'translateX(-50%)';
                wrapper.style.width = '40px';
                wrapper.style.height = '40px';
                wrapper.style.pointerEvents = 'auto';

                // 클릭 이벤트: FullCalendar의 eventClick 트리거
                wrapper.onclick = (e) => {
                  e.stopPropagation();
                  if (arg.view.calendar) {
                    arg.view.calendar.trigger('eventClick', {
                      el: wrapper,
                      event: arg.event,
                      jsEvent: e,
                      view: arg.view,
                    });
                  }
                };

                const img = document.createElement('img');
                img.src = image;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                wrapper.appendChild(img);
                return { domNodes: [wrapper] };
              }
              return { html: `<div>${arg.event.title}</div>` };
            }}
            dateClick={handleDateClick}
            editable
            droppable
            eventReceive={handleEventReceive}
            eventClick={handleEventClick}
            datesSet={(arg) => {
              const currentDate = arg.view.currentStart;
              const yyyy = currentDate.getFullYear();
              const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
              const monthStr = `${yyyy}-${mm}`;
              if (monthStr !== currentMonthStr && writtenDates !== null) {
                fetchCalendarData(monthStr, writtenDates);
                fetchScheduleData(monthStr);
                setCurrentMonthStr(monthStr);
              }
            }}
            ref={calendarRef}
            displayEventTime={false}
            dayCellClassNames={(arg) => {
              const cellDate = arg.date;
              const yyyy = cellDate.getFullYear();
              const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
              const dd = String(cellDate.getDate()).padStart(2, '0');
              const formattedDate = `${yyyy}-${mm}-${dd}`;
              return formattedDate === selectedDate ? ['selected-cell'] : [];
            }}
            selectable={true} // 드래그 활성화
            select={(info) => {
              const start = new Date(info.start);
              const end = new Date(info.end);

              const diffMs = end.getTime() - start.getTime();
              const diffHours = diffMs / (1000 * 60 * 60);

              if (diffHours <= 24) {
                // ✅ 하루 이하 선택은 무시 (원클릭 간주)
                return;
              }

              setSelectionInfo({
                start: info.startStr.split('T')[0],
                end: info.endStr.split('T')[0],
              });
              setIsModalOpen(true); // 진짜 드래그일 때만 등록
            }}
          />
          <CalendarModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectionInfo={selectionInfo}
            onSubmitEvent={handleAddEvent}
          />
          <CalendarDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            eventInfo={selectedEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onSwitchToEdit={handleEditEvent}
          />
          <CalendarEditModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            eventInfo={selectedEvent}
            onSave={handleSaveEdit}
          />
        </div>
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo selectedDate={selectedDate} onTodoChange={() => setLocalTodoTrigger(Date.now())} />
        </div>
      </div>
      <FooterBag />
    </div>
  );
};

export default CalendarView;

import React, { useState, useEffect } from 'react';
import ColorSelector from './ColorSelector';

const CalendarEditModal = ({ isOpen, onClose, eventInfo, onSave, onCancel }) => {
  const [useAllDay, setUseAllDay] = useState(true);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [titleError, setTitleError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#BAFFC9');

  useEffect(() => {
    if (useAllDay) {
      setStartTime("00:00");
      setEndTime("23:59");
    } else {
      setStartTime("08:00");
      setEndTime("18:00");
    }
  }, [useAllDay]);

  useEffect(() => {
    if (isOpen && eventInfo) {
      const { title: eventTitle, start, end, extendedProps, allDay, backgroundColor } = eventInfo;
      const { content: eventContent } = extendedProps;

      const startDateObj = new Date(start);
      const endDateObj = new Date(end);

      let displayEndDate = endDateObj;
      if (allDay) {
        displayEndDate = new Date(endDateObj);
        displayEndDate.setDate(displayEndDate.getDate() - 1);
      }

      const startDateStr = startDateObj.toLocaleDateString('sv-SE');
      const endDateStr = displayEndDate.toLocaleDateString('sv-SE');

      const startTimeStr = startDateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', hour12: false });
      const endTimeStr = endDateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', hour12: false });

      setTitle(eventTitle);
      setContent(eventContent || '');
      setUseAllDay(allDay);
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      setSelectedColor(backgroundColor || '#BAFFC9');

      if (!allDay) {
        setStartTime(startTimeStr);
        setEndTime(endTimeStr);
      }

      setTitleError('');
    }
  }, [isOpen, eventInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      setTitleError('입력 필수');
      return;
    }

    setTitleError('');

    const startDateTime = `${startDate}T${useAllDay ? '00:00' : startTime}`;
    let endDateTime;

    if (useAllDay) {
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      endDateTime = `${endDateObj.toISOString().split('T')[0]}T00:00`;
    } else {
      endDateTime = `${endDate}T${endTime}`;
    }

    const updatedEventData = {
      title,
      start: startDateTime,
      end: endDateTime,
      allDay: useAllDay,
      backgroundColor: selectedColor,
      borderColor: selectedColor,
      textColor: '#000',
      extendedProps: {
        content,
        type: 'SCHEDULE',
        scheduleId: eventInfo.extendedProps.scheduleId
      },
    };

    onSave(updatedEventData);
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!isOpen || !eventInfo) return null;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 3000; 
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          position: relative;
        }

        .modal-content form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .modal-content label {
          font-weight: bold;
        }

        .modal-content input,
        .modal-content textarea {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .modal-content input:focus,
        .modal-content textarea:focus {
          outline: none;
          border: 2px solid #84cc16;
          box-shadow: 0 0 3px #84cc16;
        }

        .modal-content input[disabled] {
          background-color: #e9ecef;
          color: #555;
        }

        .modal-content textarea {
          min-height: 100px;
          resize: vertical;
        }

        .modal-content button[type="submit"] {
          background: #84cc16;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .modal-content button[type="submit"]:hover {
          background: #84cc16;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
        }

        .close-button:hover {
          color: #333;
        }

        .button-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .cancel-button {
          background: #6c757d;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .cancel-button:hover {
          background: #5a6268;
        }
      `}</style>

      <div
        className="modal-overlay"
        onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) {
            onClose();
          }
        }}
      >
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label>일정명 *</label>
              <ColorSelector selectedColor={selectedColor} onSelectColor={(color) => setSelectedColor(color)} />
              {titleError && <span style={{ color: 'red', fontSize: '12px' }}>{titleError}</span>}
            </div>
            <input 
              type="text" 
              name="title" 
              placeholder="일정명을 입력하세요" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>시작일자</label>
            <input type="date" name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={useAllDay} />

            <label>종료일자</label>
            <input type="date" name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={useAllDay} />

            <label>일정내용</label>
            <textarea 
              name="content" 
              placeholder="일정 내용을 입력하세요" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div>
              <input
                type="checkbox"
                id="allDay"
                checked={useAllDay}
                onChange={() => setUseAllDay(!useAllDay)}
                style={{ marginRight: '5px' }}
              />
              <label htmlFor="allDay">하루 종일</label>
            </div>

            <div className="button-container">
              <button type="submit">수정완료</button>
              <button type="button" onClick={handleCancel} className="cancel-button">취소</button>
            </div>
          </form>

          <button onClick={handleCancel} className="close-button">
            <img src="/assets/img/mentors/x.png" alt="닫기" />
          </button>
        </div>
      </div>
    </>
  );
};

export default CalendarEditModal;

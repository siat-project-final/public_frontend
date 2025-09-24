import React, { useState } from 'react';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import Sidebar from '../../../components/common/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../App.css';
import Todo from '../../../components/common/Todo';

const MentoringDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const mentorData = location.state?.mentor || {
    name: 'Sophia Bennett',
    position: 'Backend Developer',
    company: 'Tech Innovators Inc.',
    mentor_image_url: '/assets/img/mentors/mentor1.jpg',
  };
  

  const mentor = {
    name: mentorData.name,
    position: mentorData.position,
    company: mentorData.company,
    mentor_image_url: mentorData.mentorImageUrl,
    description: [
      `${mentorData.company} ${mentorData.position}`,
      '백엔드 개발 경력 8년, 대규모 앱 애플리케이션 설계 및 구축 경험',
      '주니어 개발자 멘토링 및 기술 지식 공유에 열정 있음',
    ],
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  const localDate = new Date(selectedDate);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const selectedDateStr = `${year}-${month}-${day}`;
  const handleApplyClick = () => {
    navigate('/mentoring/apply', {
      state: {
        mentor: mentorData,  
        selectedDate: selectedDateStr,
      },
    });
  };

  return (
    <div>
      <Header menuType="mentoring" />
      <div className="container-flex">
        <Sidebar menuType="mentoring" />
        <main className="main" style={{ background: '#f8fafc', minHeight: '100vh', flex: 1 }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0' }}>
            <div
              style={{
                display: 'flex',
                gap: 40,
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: 32,
                alignItems: 'flex-start',
              }}
            >
              {/* 프로필 이미지 */}
              <div
                style={{
                  flex: '0 0 220px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  // alignItems: 'flex-start',
                  paddingLeft: 16,
                  marginLeft: '40px',
                }}
              >
                <img
                  src={mentor.mentor_image_url}
                  alt={mentor.name}
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: '24px',
                    objectFit: 'cover',
                    marginBottom: 16,
                    background: '#f3e7e1',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/img/mentors/mentor1.jpg';
                  }}
                />
                <div style={{ color: '#000', fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
                  {mentor.name}
                </div>
                <div style={{ color: '#374151', fontWeight: 500, fontSize: 15, marginBottom: 8, textAlign: 'center', whiteSpace: 'pre-line' }}>
                  {`${mentor.position}\nat ${mentor.company}`}
                </div>
                <div style={{ color: '#6b7280', fontWeight: 500, fontSize: 14, marginBottom: 8 }}>
                  Career
                </div>
                <ul
                  style={{
                    color: '#222',
                    fontSize: 14,
                    paddingLeft: 18,
                    margin: 0,
                    marginBottom: 0,
                    listStyleType: 'disc',
                  }}
                >
                  {mentor.description.map((desc, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
              {/* 캘린더 & 버튼 */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 320,
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 32,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    formatDay={(locale, date) => date.getDate()}
                    tileDisabled={({ date }) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;  // 🔥 오늘 이전이면 비활성화
                    }}
                    tileClassName={({ date }) =>
                      date.getTime() === selectedDate.getTime() ? 'selected-date' : null
                    }
                  />
                  <style>
                    {`
                      .react-calendar__tile--active {
                        color: white !important;
                        border-radius: 4px !important; 
                        background: #84cc16 !important;
                      }

                      .react-calendar__tile--hasActive {
                        background: #84cc16 !important;
                        color: white !important;
                        border-radius: 4px !important; /* 원한다면 모양 변경 */
                      }
                      .react-calendar__tile--now {
                        background: #dee2e6 !important;
                        color: #000 !important;
                        border-radius: 4px !important;
                      }
                      .react-calendar__tile--now:enabled:hover,
                      .react-calendar__tile--now:enabled:focus {
                        background: #84cc16 !important;
                        color: white !important;
                      }
                      .react-calendar abbr {
                        text-decoration: none;
                        border: none;
                      }
                      .react-calendar__tile:enabled:hover {
                      background: #c5f18a !important; /* 원하는 hover 색상 */
                      color: black !important;
                      border-radius: 4px !important;  /* 선택한 스타일에 따라 */
                    }
                    `}
                  </style>
                </div>
                <button
                  onClick={handleApplyClick}
                  style={{
                    background: '#84cc16',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 24,
                    padding: '12px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(95,207,128,0.08)',
                  }}
                >
                  대화내용 사전작성하기
                </button>
              </div>
            </div>
          </div>
        </main>
        {/* 오른쪽: Todo 사이드바 */}
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default MentoringDetail;

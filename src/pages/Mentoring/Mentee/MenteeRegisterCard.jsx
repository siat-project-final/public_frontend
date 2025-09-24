import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hideMentoringReservation } from '../../../api/mentoring'; // ✅ 서버 연동 API 불러오기

const MenteeRegisterCard = ({
  reservationId,
  date,
  mentorName,
  status,
  mentorImageUrl,
  subject,
  onCancel,
  link,  // ✅ 여기 추가
}) => {
  const navigate = useNavigate();
  const [isClosed, setIsClosed] = useState(false); // ✅ UI 제거용 상태

  // 🔥 여기 넣으면 좋음
  // console.log("MenteeRegisterCard link 확인:", link, "for reservationId:", reservationId);

  const handleClose = async () => {
    try {
      await hideMentoringReservation(reservationId); // ✅ 서버에 닫기 요청
      setIsClosed(true); // UI에서 제거
    } catch (err) {
      console.error('닫기 실패:', err);
      alert('예약을 닫는 데 실패했습니다.');
    }
  };

  if (isClosed) return null; // 닫힌 경우 렌더링 안 함

  const statusToKorean = {
    PENDING: '예약 대기',
    ACCEPTED: '예약 확정',
    CANCELLED: '예약 취소',
    REJECTED: '예약 거절',
    COMPLETED: '멘토링 완료',
  };

  const isConfirmed = status === 'PENDING';

  const defaultMentorImages = [
    '/assets/img/mentors/mentor1.jpg',
    '/assets/img/mentors/mentor2.jpg',
    '/assets/img/mentors/mentor3.jpg',
  ];

  const getMentorImage = () => {
    if (mentorImageUrl && mentorImageUrl !== '') return mentorImageUrl;
    const nameHash = mentorName ? mentorName.charCodeAt(0) % 3 : 0;
    return defaultMentorImages[nameHash];
  };

  const statusStyle = {
    backgroundColor: isConfirmed ? '#e2e8f0' : '#f1f5f9',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '9999px',
  };

  const handleProfileClick = () => {
    navigate('/mentoring/detail', {
      state: {
        mentor: {
          name: mentorName,
          mentor_image_url: mentorImageUrl,
          position: '직함',
          company: '회사명',
        },
        selectedDate: date.split(' ')[0],
        mode: 'readOnly',
      },
    });
  };

  const handleCancel = () => {
    onCancel();
    navigate('/register/cancel', {
      state: {
        reservationId,
        status,
      },
    });
  };

  const showCancelBtn = status === 'PENDING' || status === 'ACCEPTED';
  const showCloseBtn = status === 'REJECTED' || status === 'CANCELLED' || status === 'COMPLETED';

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          border: '1px solid #e2e8f0',
          padding: '16px',
          borderRadius: '8px',
          flexGrow: 1,
          marginRight: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{date}</span>
          <span style={statusStyle}>{statusToKorean[status] || status}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
          <img
            src={getMentorImage()}
            alt={mentorName}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              marginRight: '12px',
              objectFit: 'cover',
              border: '2px solid #e2e8f0',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/img/mentors/mentor1.jpg';
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '6px' }}>{mentorName}</span>

          {status === 'ACCEPTED' && link && (
            <a
               href={link} // ✅ navigate 대신 a 태그로 링크 걸기
              target="_blank"
              rel="noopener noreferrer"
              title="오픈채팅방으로 이동"
              style={{
                fontSize: '14px',
                color: '#0ea5e9',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                
              }}
            >
              🔗
            </a>
          )}
          
        </div>

        <div style={{ marginTop: '8px', fontSize: '14px', color: '#475569' }}>
          🗣 <strong>{subject}</strong>
        </div>
      </div>

      {showCancelBtn && (
        <button
          onClick={handleCancel}
          style={{
            backgroundColor: '#84cc16',
            color: 'white',
            fontWeight: 600,
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(95,207,128,0.08)',
          }}
        >
          예약 취소
        </button>
      )}

      {showCloseBtn && (
        <button
          onClick={handleClose}
          style={{
            backgroundColor: '#94a3b8',
            color: 'white',
            fontWeight: 600,
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(100,116,139,0.1)',
          }}
        >
          닫기
        </button>
      )}
    </div>
  );
};

export default MenteeRegisterCard;

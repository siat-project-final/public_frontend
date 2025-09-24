import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmOnlyModal from '../../../components/common/ConfirmOnlyModal';
import { hideMentoringReservationByMentor } from '../../../api/mentoring';

const MentorRegisterCard = ({
  id,
  date,
  memberName,
  status,
  mentorImg,
  onCancel = () => {},
  onAccept = () => {},
  onReject = () => {},
  onComplete = () => {},
}) => {
  const navigate = useNavigate();
  const [isClosed, setIsClosed] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const statusTextMap = {
    PENDING: '예약 대기',
    ACCEPTED: '예약 확정',
    COMPLETED: '멘토링 완료',
    REJECTED: '거절됨',
    CANCELLED: '취소됨',
  };

  const displayStatus = statusTextMap[status] || status;

  const statusStyle = {
    backgroundColor: displayStatus === '예약 대기' ? '#f1f5f9' : '#e2e8f0',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '9999px',
  };

  const buttonStyle = {
    fontWeight: 600,
    border: 'none',
    borderRadius: '24px',
    padding: '10px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginLeft: '8px',
    minWidth: '120px',
    textAlign: 'center',
  };

  const handleAcceptClick = () => {
    onAccept(id);
    setShowAcceptModal(true);
  };

  const handleCompleteClick = () => {
    onComplete(id);
    setShowCompleteModal(true);
  };

  const handleCancelClick = () => {
    navigate('/register/cancel', {
      state: {
        reservationId: id,
        memberName: memberName,
        date: date,
        status: status,
      },
    });
  };
  const handleClose = async () => {
    try {
      await hideMentoringReservationByMentor(id); // ✅ 서버에 닫기 요청
      setIsClosed(true); // UI 제거
    } catch (err) {
      console.error('멘토용 닫기 실패:', err);
      alert('예약을 닫는 데 실패했습니다.');
    }
  };

  if (isClosed) return null;
  const handleRejectClick = () => {
    navigate('/mentoring/mentor/reject', {
      state: {
        reservationId: id,
        memberName: memberName,
        date: date,
        status: status,
      },
    });
  };
  const showCloseBtn = ['REJECTED', 'CANCELLED', 'COMPLETED'].includes(status);

  return (
    <>
      <div
        style={{
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
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
            <span style={statusStyle}>{displayStatus}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
            <span style={{ fontSize: '14px' }}>멘티: {memberName}</span>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          {status === 'PENDING' && (
            <>
              <button
                onClick={handleAcceptClick}
                style={{ ...buttonStyle, backgroundColor: '#84cc16', color: '#fff' }}
              >
                예약 수락
              </button>
              <button
                onClick={handleRejectClick}
                style={{ ...buttonStyle, backgroundColor: '#ced4da', color: '#fff' }}
              >
                예약 거절
              </button>
            </>
          )}

          {status === 'ACCEPTED' && (
            <>
              <button
                onClick={handleCancelClick}
                style={{ ...buttonStyle, backgroundColor: '#334155', color: 'white' }}
              >
                예약 취소
              </button>
              <button
                onClick={handleCompleteClick}
                style={{ ...buttonStyle, backgroundColor: '#0ea5e9', color: 'white' }}
              >
                멘토링 완료
              </button>
            </>
          )}
          {showCloseBtn && (
            <button
              onClick={handleClose}
              style={{
                ...buttonStyle,
                backgroundColor: '#94a3b8',
                color: 'white',
              }}
            >
              닫기
            </button>
          )}
        </div>
      </div>

      {/* 모달 */}
      <ConfirmOnlyModal
        visible={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        message="멘토링이 예약되었습니다"
      />
      <ConfirmOnlyModal
        visible={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        message={
          <>
            멘토링에 참여해주셔서 감사합니다!
            <br />
            앞으로도 멘토님의 적극적인 참여를 기대하겠습니다:)
          </>
        }
      />
    </>
  );
};

export default MentorRegisterCard;

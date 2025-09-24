import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import ConfirmCancelModal from '../../../components/common/ConfirmCancelModal';
import Todo from '../../../components/common/Todo'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { rejectMentoring } from '../../../api/mentoring';

const rejectReasons = [
  '갑작스러운 일정 변경이 생겼어요.',
  '개인 사정으로 참여가 어려워졌어요.',
  '건강상 문제로 참여가 어렵습니다.',
  '다른 일정과 겹쳐서 참석이 어렵습니다.',
  '준비가 부족해서 다음 기회에 참여하고 싶어요',
  '기타 사유',
];

const MentoringReject = () => {
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const navigate = useNavigate();
  const location = useLocation();


  const handleCheck = (idx) => {
    setSelected((prev) => {
      const updated = prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx];
      if (updated.length > 0) setShowWarning(false);
      return updated;
    });
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      setShowWarning(true);
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      let selectedReasons = selected.map((idx) => rejectReasons[idx]);
      const otherIdx = rejectReasons.length - 1;

      if (selected.includes(otherIdx) && otherReason.trim() !== '') {
        selectedReasons[selectedReasons.indexOf('기타 사유')] = `기타: ${otherReason}`;
      }

      const reasonText = selectedReasons.join(', ');

      // 실제 API 호출
      await rejectMentoring(location.state?.reservationId, reasonText);

      alert('예약이 거절되었습니다.');
      navigate('/mentoring/mentor/register', { 
        state: { 
          rejectedReservationId: location.state?.reservationId 
        } 
      });
    } catch (err) {
      console.error('예약 거절 중 오류:', err);
      alert('예약 거절 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setShowModal(false);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <Header menuType="mentoring" />
      <div className="container-flex">
        <Sidebar menuType="mentoring" />
        <main className="main" style={{ minHeight: '100vh' }}>
          <div style={{ paddingTop: '80px', paddingBottom: '64px' }}>
            <div className="mb-4" style={{ textAlign: 'center' }}>
              <h4
                style={{
                  fontSize: '30px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '60px',
                }}
              >
                예약 거절 사유{' '}
                <span style={{ fontSize: '20px', fontWeight: 500, color: 'red' }}>(필수)</span>
              </h4>
              {showWarning && (
                <p style={{ fontSize: '14px', color: '#e11d48' }}>
                  거절 사유를 하나 이상 선택해주세요.
                </p>
              )}
            </div>

            <form onSubmit={handleReject}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '24px',
                  alignItems: 'flex-start',
                  maxWidth: '500px',
                  marginLeft: '200px',
                }}
              >
                {rejectReasons.map((reason, idx) => {
                  const isOther = reason === '기타 사유';
                  return (
                    <label
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '15px',
                        color: '#334155',
                        width: '100%',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(idx)}
                        onChange={() => handleCheck(idx)}
                        style={{
                          marginRight: '12px',
                          width: '18px',
                          height: '18px',
                          accentColor: '#94a3b8',
                        }}
                      />
                      {reason}
                      {isOther && selected.includes(idx) && (
                        <input
                          type="text"
                          placeholder="사유를 입력해주세요"
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                          style={{
                            marginLeft: '12px',
                            width: '350px',
                            padding: '6px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '14px',
                          }}
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: '48px', marginBottom: '40px' }}>
                <button
                  type="submit"
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
                  예약 거절
                </button>
              </div>
            </form>

            <ConfirmCancelModal
              visible={showModal}
              message={`예약을 거절하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
              onConfirm={handleConfirm}
              onCancel={handleClose}
            />
          </div>
        </main>

        {/* 오른쪽 Todo 영역 추가 */}
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default MentoringReject;

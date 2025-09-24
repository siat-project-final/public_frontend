import React from 'react';

const ConfirmOnlyModal = ({ visible, message, onClose }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '32px 40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          textAlign: 'center',
          width: 400,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>{message}</div>
        {/* <div style={{ color: '#555', marginBottom: 24, whiteSpace: 'pre-line' }}>
          멘토 수락 후, 대화 일정이 확정됩니다. 예약목록에서 신청 현황을 확인해보세요.
        </div> */}
        <button
          onClick={onClose}
          style={{
            background: '#84cc16',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            padding: '10px 32px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ConfirmOnlyModal;

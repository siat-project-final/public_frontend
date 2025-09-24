import React from 'react';

const ConfirmCancelModal = ({ visible, message, onConfirm, onCancel }) => {
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
          padding: '32px 24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          textAlign: 'center',
          minWidth: 320,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={onConfirm}
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
            예
          </button>
          <button
            onClick={onCancel}
            style={{
              background: '#eee',
              color: '#222',
              border: 'none',
              borderRadius: 24,
              padding: '10px 32px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;

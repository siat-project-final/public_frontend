import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import { deleteNotification, getNotificationsMentor } from '../../api/notification';

const MentorAlarm = () => {
  const [alerts, setAlerts] = useState([]);

  const memberId = localStorage.getItem('memberId');

  const fetchAlerts = () => {
    getNotificationsMentor(memberId)
      .then((res) => {
        setAlerts(res.data);
      })
      .catch((err) => {
        console.error('멘토알림 조회 실패:', err);
      });
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleClose = (notificationId) => {
    deleteNotification(notificationId)
      .then(() => {
        setAlerts((prev) =>
          prev.filter((alert) => alert.notificationId !== notificationId)
        );
        fetchAlerts();
      })
      .catch((err) => {
        console.error('알림 삭제 실패:', err);
      });
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <div className="container-flex" style={{ display: 'flex' }}>
            <Sidebar menuType="alarm" />
            <main className="main">
              <h1
                className="h3 fw-bold"
                style={{
                  marginTop: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  color: '#84cc16',
                }}
              >
                알람
              </h1>

              <section className="alerts-section">
  <div className="container" style={{ maxWidth: '700px', width: '100%' }}>
    {alerts.length === 0 ? (
      <p style={{ border: '2px dashed #999', padding: '16px', textAlign: 'center' }}>
        메시지가 없습니다.
      </p>
    ) : (
      alerts.map((alert, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #999',
            padding: '24px 16px',
            marginBottom: '15px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            whiteSpace: 'pre-line',
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold' }}>{alert.title}</p>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
              {alert.date?.split('T')[0]}
            </p>
            <p>{alert.contents}</p>
          </div>
          <button style={buttonStyle} onClick={() => handleClose(idx)}>
            닫기
          </button>
        </div>
      ))
    )}
  </div>
</section>

            </main>
          </div>
        </div>
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

// 공통 버튼 스타일
const buttonStyle = {
  background: '#84cc16',
  color: '#fff',
  border: 'none',
  borderRadius: 24,
  padding: '10px 32px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
};

export default MentorAlarm;

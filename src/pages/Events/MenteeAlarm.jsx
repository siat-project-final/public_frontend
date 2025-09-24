import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import { deleteNotification, getNotificationsMentor } from '../../api/notification';
import { useNavigate } from 'react-router-dom';

const MenteeAlarm = () => {
  const [alerts, setAlerts] = useState([]);
  // ❌ 삭제: linksToStore 상태는 더 이상 필요 없음
  // const [linksToStore, setLinksToStore] = useState([]);

  const navigate = useNavigate();
  const memberId = localStorage.getItem('memberId');

  const fetchAlerts = () => {
    getNotificationsMentor(memberId)
      .then((res) => {
        setAlerts(res.data);
        console.log('MenteeAlarm: Raw API Response for Notifications:', res.data);

        // ❌ 삭제: linksToStore를 위한 링크 추출 로직은 더 이상 필요 없음
        // const allLinks = res.data.flatMap(alert => {
        //   const currentReservationId = alert.notificationId;
        //   const regex = /(https?:\/\/[^\s]+)/g;
        //   const foundLinks = (alert.contents.match(regex) || []);
        //
        //   console.log(`MenteeAlarm: Processing alert for reservationId ${currentReservationId}`);
        //   console.log(`  Contents: "${alert.contents}"`);
        //   console.log(`  Found links (from regex):`, foundLinks);
        //
        //   return foundLinks.map(link => ({
        //     reservationId: currentReservationId,
        //     link: link
        //   }));
        // });
        //
        // console.log('MenteeAlarm: Extracted allLinks before storing:', allLinks);
        // setLinksToStore(allLinks); // 이 줄도 제거
      })
      .catch((err) => {
        console.error('멘토알림 조회 실패:', err);
      });
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // ❌ 삭제: linksToStore가 업데이트될 때 localStorage에 저장하는 useEffect는 더 이상 필요 없음
  // useEffect(() => {
  //   if (linksToStore.length > 0) {
  //     localStorage.setItem('mentoringLinks', JSON.stringify(linksToStore));
  //     console.log('MenteeAlarm: Mentoring links saved to localStorage:', JSON.parse(localStorage.getItem('mentoringLinks')));
  //   } else {
  //     console.log('MenteeAlarm: No links to store, localStorage not updated or cleared.');
  //     // 필요하다면 localStorage.removeItem('mentoringLinks'); 를 호출하여 이전 데이터를 지울 수 있습니다.
  //   }
  // }, [linksToStore]);

  const handleDelete = (notificationId) => {
    deleteNotification(notificationId)
      .then(() => {
        setAlerts((prev) => prev.filter((alert) => alert.notificationId !== notificationId));
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
                style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', color: '#84cc16' }}
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
                    alerts.map((alert) => (
                      <div
                        key={alert.notificationId}
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
                        <div style={{ flex: 1, marginRight: 16 }}>
                          <b>{alert.title}</b>
                          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                            {alert.date?.split('T')[0]}
                          </p>
                          <p style={{ marginTop: 8, whiteSpace: 'pre-line' }}>
                            {/* 알림 내용에서 링크를 감지하여 <a> 태그로 변환 */}
                            {alert.contents.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
                              part.match(/(https?:\/\/[^\s]+)/) ? (
                                <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>
                                  {part}
                                </a>
                              ) : (
                                <span key={index}>{part}</span>
                              )
                            )}
                          </p>
                        </div>
                        <button
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
                          onClick={() => handleDelete(alert.notificationId)}
                        >
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

export default MenteeAlarm;
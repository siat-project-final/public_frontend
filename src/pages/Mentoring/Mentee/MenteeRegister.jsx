import React, { useState, useEffect } from 'react'; // useMemo 필요 없음
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import MenteeRegisterCard from './MenteeRegisterCard';
import Todo from '../../../components/common/Todo';
import { getMentoringReservations } from '../../../api/mentoring';

const MenteeRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const memberId = localStorage.getItem('memberId');

  // 🟢🟢🟢 제거: localStorage에서 링크를 가져오는 useMemo 로직은 이제 필요 없음 🟢🟢🟢
  // const mentoringLinksMap = useMemo(() => { /* ... */ }, []);

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hour = String(dateObj.getHours()).padStart(2, '0');
    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}`; // ✅ 시간 제거
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getMentoringReservations(memberId);
        console.log('MenteeRegister: Raw Reservations API Response:', response.data);

        const formatted = response.data.map((res) => {
          // 🟢🟢🟢 핵심 수정: res.openChatUrl 필드에서 직접 링크 가져오기 🟢🟢🟢
          // API 응답에 openChatUrl 필드가 이미 존재하므로 이를 사용합니다.
          const link = res.openChatUrl || null; 

          return {
            ...res,
            date: formatDate(res.date),
            link: link, // 이제 올바른 링크가 할당됩니다.
          };
        });

        console.log('MenteeRegister: Formatted reservations with links:', formatted);
        setReservations(formatted);
      } catch (error) {
        console.error('❌ 예약 조회 실패:', error);
      }
    };

    if (memberId) fetchReservations();
  }, [memberId]); // mentoringLinksMap 의존성 제거

  // "닫기" 후 목록에서 제거 로직은 동일
  useEffect(() => {
    if (location.state?.cancelledReservationId && !location.state?.alreadyRemoved) {
      setReservations((prev) =>
        prev.filter((res) => res.reservationId !== location.state.cancelledReservationId)
      );

      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          alreadyRemoved: true,
        },
      });
    }
  }, [location.state, navigate, location.pathname]);

  const handleCancelReservation = (reservationId) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.reservationId === reservationId
          ? { ...res, status: 'CANCELLED' }
          : res
      )
    );
  };

  const renderEmptyMessage = () => {
    if (reservations.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
          예약된 멘토링이 없습니다.
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Header menuType="mentoring" />
      <div className="container-flex">
        <Sidebar menuType="mentoring" />
        <main className="main" data-aos="fade-up">
          <div className="max-w-2xl mx-auto pt-10 pb-16">
            <h3 className="text-2xl fw-bold mb-8 text-slate-900" style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}>
              예약된 멘토링
            </h3>
            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '20px 0' }}></div>
            <div>
              {renderEmptyMessage()}
              {reservations.map((res) => (
                <MenteeRegisterCard
                  key={res.reservationId}
                  {...res}
                  link={res.link} // 이제 res.link에 openChatUrl 값이 들어갑니다.
                  onCancel={() => handleCancelReservation(res.reservationId)}
                />
              ))}
            </div>
          </div>
        </main>
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default MenteeRegister;
import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import MentorRegisterCard from './MentorRegisterCard';
import { getMentorReservations, acceptMentoring, completeMentoring } from '../../../api/mentoring';

const MentorRegister = () => {
    const [reservations, setReservations] = useState([]);
    // const memberId = localStorage.getItem('memberId');
    const location = useLocation();
    const navigate = useNavigate();
    const memberId = localStorage.getItem('memberId');
    const mentorId = localStorage.getItem('mentorId'); 

    console.log(' MentorRegister 컴포넌트 마운트');
    console.log(' memberId (로그인된 사용자):', memberId);
    console.log(' location.state:', location.state);

    useEffect(() => {
        if (!memberId) return;

        const fetchReservations = async () => {
            try {
                console.log(' 예약 목록 조회 시작, mentorId:', memberId);
                const response = await getMentorReservations(mentorId);
                console.log(' API 응답 전체:', response.data);
                if (response.data.length === 0) {
                    console.warn(' 해당 mentorId로 조회된 예약이 없습니다.');
                }
                response.data.forEach((res, idx) => {
                    console.log(`예약 ${idx + 1}:`, res);
                });
                setReservations(response.data);
            } catch (error) {
                console.error(' 멘토 예약 조회 실패:', error);
            }
        };

        fetchReservations();
    }, [memberId]);

    useEffect(() => {
        if (location.state?.rejectedReservationId) {
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        if (location.state?.cancelledReservationId && !location.state?.alreadyRemoved) {
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, location.pathname]);

    const handleCancel = (reservationId) => {
        console.log(' 예약 취소 로직 생략됨, reservationId:', reservationId);
    };

    const handleReject = (reservationId) => {
        console.log(' 예약 거절 로직 생략됨, reservationId:', reservationId);
    };

    const handleAccept = async (reservationId) => {
        try {
            await acceptMentoring(reservationId);
            setReservations(prev =>
                prev.map(res =>
                    res.reservationId === reservationId
                        ? { ...res, status: 'CONFIRMED' }
                        : res
                )
            );
        } catch (error) {
            console.error('예약 수락 실패:', error);
            alert('예약 수락 중 오류가 발생했습니다.');
        }
    };

    const handleComplete = async (reservationId) => {
        try {
            const reservation = reservations.find(res => res.reservationId === reservationId);
            const mentorMemberId = localStorage.getItem('memberId');
            const menteeId = reservation.menteeId;

            console.log(' 멘토링 완료 요청 정보:', { reservationId, mentorMemberId, menteeId });

            if (!mentorId || !menteeId) {
                alert('멘토링 완료를 위한 필수 정보가 누락되었습니다.');
                return;
            }

            await completeMentoring({ reservationId, mentorMemberId, menteeId });
            const updated = reservations.filter(res => res.reservationId !== reservationId);
            setReservations(updated);
        } catch (error) {
            console.error('멘토링 완료 처리 실패:', error);
            alert('멘토링 완료 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <Header menuType="mentoring" />
            <div className="container-flex">
                <Sidebar menuType="mentoring" />
                <main className="main" data-aos="fade-up">
                    <div className="max-w-2xl mx-auto pt-10 pb-16">
                        <h3 className="text-2xl fw-bold mb-8 text-slate-900" style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}>
                            멘토링 예약 관리
                        </h3>
                        <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '20px 0' }}></div>
                        <div>
                            {reservations.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                                    예약 요청이 없습니다.
                                </div>
                            ) : (
                                reservations.map((res) => (
                                    <MentorRegisterCard
                                        key={`${res.reservationId}-${res.status}`}
                                        id={res.reservationId}
                                        date={res.date?.split('T')[0]}
                                        memberName={res.menteeName}
                                        status={res.status}
                                        mentorImg={res.mentorImageUrl}
                                        onCancel={handleCancel}
                                        onReject={handleReject}
                                        onAccept={handleAccept}
                                        onComplete={handleComplete}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </main>
                <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
                    {/* 사이드 컴포넌트 영역 */}
                </div>
            </div>
        </>
    );
};

export default MentorRegister;

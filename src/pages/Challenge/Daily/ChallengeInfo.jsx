import React, { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import { checkParticipation } from '../../../api/challenge'; // ✅ 실제 axios 호출 사용
import '../../../App.css';

const ChallengeInfo = () => {
  const navigate = useNavigate();
  const [hasParticipated, setHasParticipated] = useState(false);
  const memberId = sessionStorage.getItem('memberId');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    if (!memberId) return;

    checkParticipation(memberId, today)
      .then(res => {
        setHasParticipated(res.data.participated); // ✅ 서버에서 participated: true/false 반환
      })
      .catch(err => {
        console.error('참여 여부 확인 실패:', err);
        alert('서버와 연결에 문제가 있어 참여 여부를 확인하지 못했습니다.');
      });
  }, [memberId]);

  return (
    <>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="challenge" />
        <main className="main" data-aos="fade-up">
          <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1
                className="h3 fw-bold mb-0"
                style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
              >
                일일챌린지
              </h1>
            </div>
          </div>

          <section className="section">
            <div className="container text-center" style={{ padding: '40px 20px' }}>
              {!hasParticipated ? (
                <>
                  <p style={{ fontSize: '20px', marginBottom: '80px' }}>
                    일일챌린지에 도전하세요! 오늘 수강하신 강의 내용을 기반으로 5개의 문제가 출제됩니다.
                  </p>
                  <button
                    className="btn btn-dark mt-4"
                    onClick={() => navigate('/challenge/daily/solve')}
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
                    문제 풀기
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    이미 오늘의 챌린지를 완료했습니다.
                  </p>
                  <button
                    className="btn btn-dark mt-4"
                    onClick={() => navigate('/challenge/review')}
                  >
                    종합 챌린지로 이동
                  </button>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    
    </>
  );
};

export default ChallengeInfo;

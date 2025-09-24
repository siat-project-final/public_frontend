import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getTodayChallenge, getDailyRanking, checkParticipation } from '../../api/challenge';
import '../../App.css';

const ChallengeMain = () => {
  const navigate = useNavigate();
  const memberId = sessionStorage.getItem('memberId');

  const [todayChallenge, setTodayChallenge] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [hasParticipated, setHasParticipated] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    getTodayChallenge()
      .then((res) => {
        setTodayChallenge(res.data[0]);
      })
      .catch((err) => {
        console.error('챌린지 과목 데이터 불러오기 실패:', err);
        alert('챌린지 과목 데이터를 불러오는 데 실패했습니다.');
      });

    getDailyRanking(today)
      .then((res) => {
        setRanking(res.data);
      })
      .catch((err) => {
        console.error('랭킹 불러오기 실패:', err);
      });

    checkParticipation(memberId, today)
      .then((res) => {
        setHasParticipated(res.data.participated); // ✅ 서버 응답: { participated: true/false }
      })
      .catch((err) => {
        console.error('참여 여부 확인 실패:', err);
      });
  }, []);

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
                챌린지
              </h1>
            </div>
          </div>

          <section className="section">
            <div className="container" style={{ paddingTop: '10px', paddingBottom: '40px' }}>
              <div className="row g-4 justify-content-center">
                {/* 일일 챌린지 */}
                <div className="col-lg-5">
                  <div className="card text-center p-4 shadow-sm" style={{ minHeight: '250px' }}>
                    <h4 className="mb-3">일일 챌린지</h4>
                    {todayChallenge ? (
                      <>
                        <p className="mb-2">
                          <strong>{todayChallenge.subject}</strong>
                        </p>
                        <br />
                        {!hasParticipated ? (
                          <button
                            className="btn btn-dark mb-2"
                            onClick={() => navigate('/challenge/daily')}
                            style={{
                              backgroundColor: '#84cc16',
                              color: '#fff',
                              border: 'none',
                            }}
                          >
                            오늘 문제 풀기
                          </button>
                        ) : (
                          <p className="text-muted">오늘의 챌린지를 이미 완료했습니다.</p>
                        )}
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => navigate('/challenge/ranking')}
                          style={{
                            backgroundColor: '#84cc16',
                            color: '#fff',
                            border: 'none',
                          }}
                        >
                          오늘의 랭킹 보기
                        </button>
                      </>
                    ) : (
                      <p>로딩 중...</p>
                    )}
                  </div>
                </div>

                {/* 종합 챌린지 */}
                <div className="col-lg-5">
                  <div className="card text-center p-4 shadow-sm" style={{ minHeight: '250px' }}>
                    <h4 className="mb-3">종합 챌린지</h4>
                    <p className="text-muted">
                      복습하고 싶은 과목의 문제를 선택하여 다시 풀어보세요.
                    </p>
                    <button
                      className="btn btn-dark"
                      onClick={() => navigate('/challenge/review')}
                      style={{
                        backgroundColor: '#84cc16',
                        color: '#fff',
                        border: 'none',
                        marginTop: '16px',
                      }}
                    >
                      복습하러 가기
                    </button>
                  </div>
                </div>
              </div>

              {/* 랭킹 */}
              <div className="row mt-5 justify-content-center">
                <div className="col-lg-10">
                  <div className="card p-4 shadow-sm">
                    <h5 className="mb-3">오늘의 랭킹 TOP 3</h5>
                    <ul className="list-group list-group-flush">
                      {ranking
                        .slice()
                        .sort((a, b) => a.rank - b.rank)
                        .slice(0, 3)
                        .map((user, idx) => (
                          <li key={idx} className="list-group-item d-flex justify-content-between">
                            <span>
                              {user.rank}위. {user.memberName}
                            </span>
                            <span>{user.totalPoints}점</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ChallengeMain;

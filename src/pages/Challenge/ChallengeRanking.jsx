import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { getDailyRanking } from '../../api/challenge'; // ✅ axios 통신 함수
import '../../App.css';

const ChallengeRanking = () => {
  const [rankingList, setRankingList] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    getDailyRanking(today)
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.totalPoints - a.totalPoints); // 점수 내림차순
        setRankingList(sorted);
      })
      .catch((err) => console.error('랭킹 불러오기 실패:', err));
  }, []);

  const visibleList = showAll ? rankingList : rankingList.slice(0, 10);

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
                일일 챌린지 랭킹
              </h1>
            </div>
            <p
              className="text-muted"
              style={{ fontSize: '20px', marginLeft: '16px', marginTop: '10px' }}
            >
              오늘 날짜 기준의 랭킹입니다.
            </p>
          </div>

          <section className="section">
            <div className="container" style={{ padding: '10px 20px 40px 20px' }}>
              <table className="table table-bordered text-center">
                {/* <thead className="table-dark"> */}
                <thead>
                  <tr>
                    <th className="ranking-header">순위</th>
                    <th className="ranking-header">이름</th>
                    <th className="ranking-header">점수</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleList.map((user, index) => (
                    <tr key={user.userId}>
                      <td>{index + 1}</td>
                      <td>{user.memberName}</td>
                      <td>{user.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {rankingList.length > 10 && (
                <div className="text-center mt-3">
                  <button className="btn btn-outline-dark" onClick={() => setShowAll(!showAll)}>
                    {showAll ? '접기' : '더보기'}
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ChallengeRanking;

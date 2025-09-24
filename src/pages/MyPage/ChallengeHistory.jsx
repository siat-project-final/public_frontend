import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import './ChallengeHistory.css';
import { getChallengeHistory } from '../../api/challenge';

const ChallengeHistory = () => {
  const memberId = localStorage.getItem('memberId');
  const [historyList, setHistoryList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // 기준이 되는 날짜

  // 현재 월(숫자) 및 연도
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 현재 월로 필터링된 데이터
  const filteredHistory = historyList
    .filter((item) => {
      const date = new Date(item.date);
      return date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth;
    })
    // 날짜 기준으로 중복 제거 (가장 첫 데이터만 유지)
    .filter((item, index, self) => index === self.findIndex((i) => i.date === item.date));

  const fetchHistory = async () => {
    try {
      const res = await getChallengeHistory(memberId);
      setHistoryList(res.data);
    } catch (err) {
      console.error('챌린지 히스토리 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [memberId]);

  // 월 변경 함수
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // 월 텍스트 출력
  const getMonthText = () => `${currentYear}년 \u00a0 ${currentMonth}월`;

  return (
    <div>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="mypage" />
        <main className="main">
          <section className="challenge-history-section" data-aos="fade-up">
            <div className="page-header">
              <h1
                className="h3 fw-bold mb-0"
                style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
              >
                챌린지 히스토리
              </h1>
              <div className="month-selector">
                <span className="current-month">{getMonthText()}</span>
                <button className="month-btn" onClick={() => changeMonth(-1)}>
                  이전
                </button>
                <button className="month-btn" onClick={() => changeMonth(1)}>
                  다음
                </button>
              </div>
            </div>

            <div className="challenge-list">
              {filteredHistory.map((item, idx) => (
                <div className="challenge-card" key={idx}>
                  <span className="challenge-date">{item.date}</span>
                  <div className="challenge-info">
                    <div className="info-item">
                      <p className="info-label">MY RANK</p>
                      <p className="info-value">{item.rank}.</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label">SUBJECT</p>
                      <p className="info-value">{item.subject}</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label">TOTAL SCORE</p>
                      <p className="info-value">{item.totalPoints}</p>
                    </div>
                  </div>
                  <Link to={`/challenge/daily/result?date=${item.date}`} className="detail-btn">
                    상세보기
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>

        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default ChallengeHistory;

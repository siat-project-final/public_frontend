import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import './Statistics.css';
import { getUserStats } from '../../api/user';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [challengeScores, setChallengeScores] = useState([]); // 챌린지 점수 추가
  const memberId = localStorage.getItem('memberId');
  const totalDays = 100; // 현재 날짜 - 시작 날짜 필요

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getUserStats(memberId);
        console.log('[통계 데이터]', res.data); // 디버깅용 로그

        // 가데이터 추가
        const mockMentoringData = {
          mentoringCount: 12, // 멘토링 횟수
          firstMentorName: '이수현', // 최초 멘토링 이름
          topMentorName: '최은정', // 최다 멘토링 이름
          topMentorSessions: 5, // 최다 멘토링 횟수
        };

        // 기존 데이터에 가데이터 병합
        const updatedStats = { ...res.data, ...mockMentoringData };
        setStats(updatedStats);

        // 예시 데이터: 실제 API 호출로 대체 가능
        const mockChallengeScores = [
          { date: '2025-07-01', score: 12 },
          { date: '2025-07-02', score: 14 },
          { date: '2025-07-03', score: 10 },
          { date: '2025-07-04', score: 13 },
          { date: '2025-07-05', score: 15 },
          { date: '2025-07-06', score: 11 },
          { date: '2025-07-07', score: 14 },
          { date: '2025-07-08', score: 13 },
          { date: '2025-07-09', score: 12 },
          { date: '2025-07-10', score: 15 },
        ];
        setChallengeScores(mockChallengeScores);
      } catch (err) {
        console.error('통계 조회 실패:', err);
      }
    };
    fetchStats();
  }, [memberId]);

  if (!stats) return <div>로딩 중...</div>;

  const getPieChartData = (count, total) => {
    const remaining = total - count;
    return {
      labels: ['작성된 학습일지', '미작성'],
      datasets: [
        {
          data: [count, remaining],
          backgroundColor: ['#84cc16', '#d1d5db'],
        },
      ],
    };
  };

  const getBarChartData = (labels, data) => ({
    labels: labels,
    datasets: [
      {
        label: '활동 통계',
        data: data,
        backgroundColor: ['#84cc16', '#d1d5db', '#f87171', '#60a5fa'],
      },
    ],
  });

  const getLineChartData = (data) => ({
    labels: data.map((item) => item.date), // 날짜 배열
    datasets: [
      {
        label: '챌린지 점수',
        data: data.map((item) => item.score), // 점수 배열
        borderColor: '#84cc16',
        backgroundColor: 'rgba(132, 204, 22, 0.2)',
        tension: 0.4, // 곡선의 부드러움
      },
    ],
  });

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <div>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="mypage" />
        <main className="main">
          <section className="statistics-section" data-aos="fade-up">
            <div className="page-header">
              <h1
                className="h3 fw-bold mb-0"
                style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
              >
                통계
              </h1>
            </div>

            {selectedCard && (
              <button
                onClick={() => setSelectedCard(null)}
                style={{
                  margin: '0 auto',
                  display: 'block',
                  marginBottom: '2rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#84cc16',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                전체 보기
              </button>
            )}

            {selectedCard === null && (
              <div className="stats-grid">
                <div
                  className="stat-card"
                  style={{ width: '350px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px #84cc16';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleCardClick('diary')}
                >
                  <div className="stats-icon">📝</div>
                  <p className="stats-value">{stats.studyDiaryCount ?? '데이터 없음'}</p>
                  <p className="stats-label">학습일지 작성 수</p>
                </div>

                <div
                  className="stat-card"
                  style={{ width: '350px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px #84cc16';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleCardClick('challenge')}
                >
                  <div className="stats-icon">🏆</div>
                  <p className="stats-value">{stats.challengeCount}</p>
                  <p className="stats-label">챌린지 완료 총 횟수</p>
                </div>

                <div
                  className="stat-card"
                  style={{ width: '350px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px #84cc16';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleCardClick('mentoring')}
                >
                  <div className="stats-icon">💬</div>
                  <p className="stats-value">{stats.mentoringCount}</p>
                  <p className="stats-label">멘토링 횟수</p>
                </div>

                <div
                  className="stat-card"
                  style={{ width: '350px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px #84cc16';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => handleCardClick('ranking')}
                >
                  <div className="stats-icon">⭐</div>
                  <p className="stats-value">{stats.challengeCount?.toLocaleString()}</p>
                  <p className="stats-label">챌린지 점수 통계</p>
                </div>
              </div>
            )}

            {selectedCard === 'diary' && (
              <div className="stat-card">
                <p className="stats-value">📝 학습일지 작성 수</p>
                <div className="pie-wrapper">
                  <Pie data={getPieChartData(stats.studyDiaryCount, totalDays)} />
                  <p className="stats-value" style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '2rem' }}>전체 수업기간</p>
                    {stats.studyDiaryCount} / {totalDays}
                  </p>
                </div>
              </div>
            )}

            {selectedCard === 'challenge' && (
              <div className="stat-card stat-wide">
                <p className="stats-value">🏆 과목별 챌린지 완료 총 횟수</p>
                <div className="bar-wrapper bar-centered">
                  <Bar
                    data={{
                      labels: ['JAVA', 'JAVASCRIPT', 'PYTHON', 'REACT', 'AWS', 'CI/CD', 'Springboot', 'HTML/CSS', 'Docker', 'Kubernetes'],
                      datasets: [
                        {
                          label: '과목별 완료 횟수',
                          data: [20, 25, 15, 18, 10, 12, 22, 30, 8, 5],
                          backgroundColor: [
                            '#84cc16', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa',
                            '#34d399', '#f472b6', '#fb923c', '#93c5fd', '#e879f9',
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {selectedCard === 'mentoring' && (
              <div className="stat-card">
                <p className="stats-value">💬 멘토링 기록</p>
                <div className="mentoring-info">
                  <div className="mentoring-block">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>최초 멘토링</p>
                    <p>{stats.firstMentorName || '데이터 없음'}</p>
                  </div>
                  <div className="mentoring-block">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>최다 멘토링</p>
                    <p>
                      {stats.topMentorName || '데이터 없음'} ({stats.topMentorSessions || 0}회)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedCard === 'ranking' && (
                <div
                  className="stat-card"
                  style={{
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '2rem',
                    borderRadius: '1rem',
                    backgroundColor: 'white',
                    boxShadow: '0 0 0 1px #e5e7eb',
                    textAlign: 'center',
                  }}
                >
                  <p className="stats-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    ⭐ 챌린지 평균 점수
                  </p>
                  <div
                    style={{
                      height: '500px',
                      width: '100%',
                      maxWidth: '1200px',
                      margin: '0 auto',
                    }}
                  >
                    <Line
                      data={getLineChartData(challengeScores)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top',
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              font: {
                                size: 16,
                              },
                            },
                            grid: {
                              display: false,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            ticks: {
                              font: {
                                size: 16,
                              },
                            },
                            grid: {
                              drawBorder: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}


            {selectedCard === 'barChart' && (
              <div className="stat-card">
                <p className="stats-value">📊 활동 통계</p>
                <div className="bar-wrapper">
                  <Bar
                    data={getBarChartData(
                      ['학습일지', '챌린지', '멘토링', '평균 점수'],
                      [stats.studyDiaryCount, stats.challengeCount, stats.mentoringCount, stats.averageScore]
                    )}
                  />
                </div>
              </div>
            )}
          </section>
        </main>

        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
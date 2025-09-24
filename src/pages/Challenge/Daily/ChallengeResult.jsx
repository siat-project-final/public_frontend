import React, {useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubmissionResult } from '../../../api/challenge';
import '../../../App.css';

const ChallengeResult = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 추가
  const query = new URLSearchParams(location.search);
  const dateParam = query.get('date');

  const [resultData, setResultData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const memberId = localStorage.getItem('memberId');

  useEffect(() => {
    const fetch = async () => {
      const today = new Date().toISOString().split('T')[0];
      const date = dateParam || today;

      getSubmissionResult(memberId, date) // ✅ 날짜 전달
        .then(res => {
          const processed = (res.data || []).map(item => {
            // 옵션 파싱 로직 그대로 유지
            let parsedOptions = [];
            try {
              const once = typeof item.options === 'string' ? JSON.parse(item.options) : item.options;
              parsedOptions = Array.isArray(once)
                ? once
                : typeof once === 'string'
                ? JSON.parse(once)
                : [];
            } catch (e) {
              console.warn(`옵션 파싱 실패 (problemId=${item.problemId}):`, e);
              alert('문제의 선택지를 불러오는 데 실패했습니다.');
            }
            return {
              ...item,
              options: parsedOptions,
              type: item.type || 'multiple',
            };
          });

          setResultData(processed);

          const score = processed
            .slice(0, 5)
            .reduce((sum, item) => sum + (item.correct ? item.difficulty : 0), 0);
          setTotalScore(score);
        })
        .catch(err => {
          console.error('결과 불러오기 실패:', err);
          alert('챌린지 결과를 불러오는 데 실패했습니다.');
        });
    };

    fetch();
  }, [memberId, dateParam]);

  return (
    <>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="challenge" />
        <main className="main">
          <div className="page-title" data-aos="fade">
            <div className="heading text-center">
              <h2>일일 챌린지 결과</h2>
            </div>
          </div>

          <section className="section">
            <div className="container" style={{ padding: '40px 20px' }}>
              {resultData.slice(0, 5).map((item, index) => (
                <div key={item.problemId} className="mb-4">
                  <h5>
                    Q{index + 1}. ({item.difficulty}점){' '}
                    {item.correct ? (
                      <span style={{ color: 'green' }}>✔ 정답</span>
                    ) : (
                      <span style={{ color: 'red' }}>✘ 오답</span>
                    )}
                  </h5>
                  <pre
                    style={{
                      background: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '8px',
                      whiteSpace: 'pre-wrap',
                      fontSize: '14px',
                    }}
                  >
                    {item.title}
                  </pre>

                  {item.type === 'multiple' && item.options && (
                    <ul className="list-group mb-2">
                      {item.options.map((opt, idx) => {
                        const optionNumber = opt.split('.')[0].trim();

                        const isCorrect = optionNumber === String(item.correctAnswer);
                        const isSubmitted = optionNumber === String(item.submitAnswer);

                        return (
                          <li
                            key={idx}
                            className={`list-group-item d-flex justify-content-between ${
                              isCorrect
                                ? 'list-group-item-success'
                                : isSubmitted
                                ? 'list-group-item-danger'
                                : ''
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && <span className="badge bg-success">정답</span>}
                            {isSubmitted && !isCorrect && (
                              <span className="badge bg-danger">내 답안</span>
                            )}
                          </li>
                        );
                      })}

                    </ul>
                  )}

                  {item.type === 'text' && (
                    <div className="text-muted">
                      <div>
                        <strong>내 답안:</strong> {item.submitAnswer}
                      </div>
                      <div>
                        <strong>정답:</strong> {item.correctAnswer}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="text-end mt-4" style={{ fontWeight: 'bold', fontSize: '18px' }}>
                총점: {totalScore}점
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-dark" onClick={() => navigate('/challenge/review')}>
                  종합 챌린지로 이동
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ChallengeResult;

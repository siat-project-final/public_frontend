import React, { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getTodayChallenge, submitChallenge } from '../../../api/challenge';
import '../../../App.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ChallengeSolve = () => {
  const navigate = useNavigate();
  const memberId = localStorage.getItem('memberId');

  const [problems, setProblems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const progress =
    problems.length > 0 ? Math.round(((currentIndex + 1) / problems.length) * 100) : 0;

  useEffect(() => {
    if (!memberId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    getTodayChallenge()
      .then((res) => {
        const parsed = (res.data || []).map((p) => {
          let options = [];
          try {
            const once = typeof p.choices === 'string' ? JSON.parse(p.choices) : p.choices;
            options = typeof once === 'string' ? JSON.parse(once) : once;
          } catch (e) {
            console.error(`선택지 파싱 실패 (problemId=${p.problemId || p.id}):`, e);
            alert('문제의 선택지를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
          }

          return {
            ...p,
            options,
            type: 'choice',
            difficulty: p.difficulty ?? 1, // ✅ 난이도 기본값 처리
          };
        });

        setProblems(parsed.slice(0, 5)); // ✅ 무조건 5문제까지만 유지
      })
      .catch((err) => {
        console.error('문제 불러오기 실패:', err);
        alert('오늘의 챌린지 문제를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
      });
  }, []);

  const handleChange = (problemId, value) => {
    setAnswers((prev) => ({ ...prev, [problemId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    const submissionData = problems.map((p) => ({
      problemId: p.problemId,
      submitAnswer: answers[p.problemId] ?? null,
      memberId,
    }));

    const requestBody = {
      memberId: Number(memberId),
      problemIds: submissionData.map((data) => data.problemId),
      answers: submissionData.map(
        (data) => (data.submitAnswer !== null ? parseInt(data.submitAnswer) : -1) // ✅ null 방지
      ),
      createdAt: new Date().toISOString(),
    };

    submitChallenge(requestBody)
      .then(() => {
        navigate('/challenge/daily/result');
      })
      .catch((err) => {
        console.error('제출 실패:', err);
        alert('제출에 실패했습니다. 나중에 다시 시도해주세요.');
      });
  };

  const currentProblem = problems[currentIndex];
  return (
    <>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="challenge" />
        <main className="main">
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
            <div
              className="container"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                flexDirection: 'row-reverse',
              }}
            >
              {/*  Progress Bar */}
              <div style={{ width: 80, marginLeft: '40px' }}>
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: '#84cc16',
                    textColor: '#333',
                    trailColor: '#e0e0e0',
                  })}
                />
              </div>

              {/* 문제 출력 */}
              {currentProblem && (
                <div className="mb-4" style={{ maxWidth: '800px', flex: '1' }}>
                  <h5 className="mb-2">
                    Q{currentIndex + 1}. (난이도: {currentProblem.points}단계)
                  </h5>

                  <pre
                    style={{
                      background: '#f8f9fa',
                      padding: '20px',
                      borderRadius: '10px',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      fontSize: '15px',
                    }}
                  >
                    {currentProblem.title}
                  </pre>

                  {currentProblem.type === 'text' ? (
                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="정답을 입력하세요"
                      value={answers[currentProblem.problemId] || ''}
                      onChange={(e) => handleChange(currentProblem.problemId, e.target.value)}
                    />
                  ) : (
                    <div className="mt-3">
                      {currentProblem.options.map((option, idx) => (
                        <div className="form-check" key={idx}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${currentProblem.problemId}`}
                            value={String(option)}
                            checked={answers[currentProblem.problemId] === String(option)}
                            onChange={(e) => handleChange(currentProblem.problemId, e.target.value)}
                            id={`option-${currentProblem.problemId}-${idx}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`option-${currentProblem.problemId}-${idx}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-center mt-4">
                    {currentIndex < problems.length - 1 ? (
                      <button type="button" onClick={handleNext} style={buttonStyle}>
                        다음 문제
                      </button>
                    ) : (
                      <button type="submit" onClick={handleSubmit} style={buttonStyle}>
                        제출
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

const buttonStyle = {
  background: '#84cc16',
  color: '#fff',
  border: 'none',
  borderRadius: 24,
  padding: '12px 32px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(95,207,128,0.08)',
  marginTop: '60px',
};

export default ChallengeSolve;

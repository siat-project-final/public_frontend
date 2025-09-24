import React, { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useLocation } from 'react-router-dom';
import { getReviewProblems } from '../../../api/challenge'; 
import '../../../App.css';

const ReviewSolve = () => {
  const location = useLocation();
  const subject = location.state?.subject;
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);

  const fetchData = async () => {
    if (!subject) return;

    const memberId = localStorage.getItem('memberId');
    getReviewProblems(memberId, subject)
      .then(res => {
        setProblem(res.data);
      })
      .catch(err => {
        console.error('문제 불러오기 실패:', err)
        alert('문제를 불러오는 데 실패했습니다. 다시 시도해주세요.');
      });
    }

  useEffect(() => {
    fetchData();
  }, [subject]);

  const handleSubmit = () => {
    if (!problem) return;
    const trimmed = answer.trim();
    const isCorrect = trimmed.toString() === problem.answer.toString();
    console.log(isCorrect);
    
    setResult(isCorrect ? '정답입니다! 🎉' : `오답입니다. 😢 (정답: ${problem.answer})`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="challenge" />
        <main className="main">
          <div className="container" style={{ paddingTop: '20px', paddingBottom: '0px' }}>
            <div className="d-flex align-items-center" style={{ marginBottom: '0px' }}>
              <h1
                className="h3 fw-bold mb-0"
                style={{ marginLeft: '16px', color: '#84cc16' }}
              >
                복습 문제 풀이
              </h1>  
            </div>
            <p className="text-muted" style={{ fontSize: '20px', marginLeft: '16px', marginTop: '30px' }}>
              주어진 문제를 읽고 정답을 입력하세요.
            </p>
          </div>


          <section className="section">
            <div className="container" style={{ padding: '40px 20px' }}>
              {problem ? (
                <>
                  <pre
                    style={{
                      background: '#f8f9fa',
                      padding: '20px',
                      borderRadius: '10px',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      fontSize: '15px',
                      marginTop: '10px',
                    }}
                  >
                    {problem.contents.replace(/\\n/g, '\n')}
                  </pre>

                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder="정답 입력"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={!!result}
                  />

                  <div className="text-center mt-4">
                    {!result ? (
                      <button className="btn btn-dark" onClick={handleSubmit}>
                        제출
                      </button>
                    ) : (
                      <>
                        <div
                          style={{
                            fontWeight: 'bold',
                            fontSize: '18px',
                            marginBottom: '10px',
                          }}
                        >
                          {result}
                        </div>
                        <button className="btn btn-outline-dark" onClick={handleRetry}>
                          한 문제 더 풀기
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p>문제를 불러오는 중입니다...</p>
              )}
            </div>
          </section>
        </main>
      </div>
      
    </>
  );
};

export default ReviewSolve;

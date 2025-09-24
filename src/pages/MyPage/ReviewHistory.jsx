import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import './ReviewHistory.css';
// ✅ axios 연동
import { getSubmissionResult } from '../../api/challenge';

const ReviewHistory = () => {
  const [reviewList, setReviewList] = useState([]);
  const memberId = sessionStorage.getItem('memberId');

  useEffect(() => {
    setReviewList([
      {
        date: '6/7',
        subject: 'JAVA',
        score: '12 / 15',
        review: '틀린 문항 복습 완료',
      },
      {
        date: '6/3',
        subject: 'REACT',
        score: '13 / 15',
        review: 'DOM 구조 이슈 재확인',
      },
    ]);
    const fetchReview = async () => {
      try {
        const res = await getSubmissionResult(memberId);
        setReviewList(res.data);
      } catch (err) {
        console.error('리뷰 히스토리 실패:', err);
      }
    };
    fetchReview();
  }, [memberId]);

  return (
    <div>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="mypage" />
        <main className="main">
          <section className="review-section" data-aos="fade-up">
            <div className="page-header">
              <h1
                className="h3 fw-bold mb-0"
                style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
              >
                CHALLENGE REVIEW
              </h1>
            </div>

            <div className="review-box">
              {reviewList.map((item, idx) => (
                <div className="challenge-card" key={idx}>
                  <span className="challenge-date">{item.date}</span>
                  <div className="challenge-info">
                    <div className="info-item">
                      <p className="info-label">SUBJECT</p>
                      <p className="info-value">{item.subject}</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label">MY SCORE</p>
                      <p className="info-value">{item.score}</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label">REVIEW</p>
                      <p className="info-value">{item.review}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 오른쪽: Todo */}
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default ReviewHistory;

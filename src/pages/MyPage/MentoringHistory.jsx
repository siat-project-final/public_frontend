import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import './MentoringHistory.css';
import { getMentoringHistory } from '../../api/user';

const MentoringHistory = () => {
  const [mentoringList, setMentoringList] = useState([]);
  const memberId = localStorage.getItem('memberId');

  const fetchMentoring = async () => {
    try {
      const res = await getMentoringHistory(memberId);
      // 날짜 기준 정렬 (최신순)
      const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMentoringList(sorted);
    } catch (err) {
      console.error('멘토링 히스토리 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchMentoring();
  }, [memberId]);

  return (
    <div>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="mypage" />
        <main className="main">
          <section className="mentoring-section" data-aos="fade-up">
            <h1
              className="h3 fw-bold mb-0"
              style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
            >
              멘토링 히스토리
            </h1>

            <div className="mentoring-boxes">
              {mentoringList.map((item, idx) => (
                <div className="mentoring-box" key={idx}>
                  <h3 className="mentoring-date">{item.date}</h3>
                  <div className="mentoring-content">
                    <div className="mentor-image">
                      <img
                        src={item.imageUrl}
                        className="img-fluid"
                        alt={item.mentorName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/img/team/team-1.jpg'; // 기본 이미지
                        }}
                      />
                    </div>
                    <div className="mentoring-form-group">
                      <label>멘토 성함</label>
                      <input type="text" value={item.mentorName} readOnly />
                      <label>대화 주제</label>
                      <input type="text" value={item.subject} readOnly />
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

export default MentoringHistory;

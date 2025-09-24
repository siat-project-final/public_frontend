import React, { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import Todo from '../../../components/common/Todo';
import { getMentors } from '../../../api/mentoring'; // 실제 API 사용
import '../../../App.css';

const MentoringList = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMentors();   // 실제 백엔드 API 호출
        console.log('[멘토 API 응답]', res.data);
        setMentors(res.data);             // 응답 데이터 state에 저장
      } catch (err) {
        console.error('멘토 목록 불러오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  const handleMentorClick = (mentor) => {
    const role = localStorage.getItem('role');
    const stateObj = {
      mentor: {
        mentorId: mentor.mentorId,
        mentorMemberId: mentor.mentorMemberId,
        name: mentor.mentorName,
        position: mentor.position,
        company: mentor.company,
        mentorImageUrl: mentor.mentorImageUrl,
      },
    };

    if (role === 'MENTOR') {
      navigate('/mentoring/other-detail', { state: stateObj });
    } else {
      navigate('/mentoring/detail', { state: stateObj });
    }
  };

  return (
    <div>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="mentoring" />
        <main className="main" data-aos="fade-up">
          <h1
            className="h3 fw-bold"
            style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
          >
            멘토링
          </h1>
          <p style={{ marginTop: '16px', marginLeft: '16px', whiteSpace: 'pre-line' }}>
            멘토와 함께 성장할 수 있는 기회{'\n'}SIAT 멘토링은 SIAT 과정을 수료한 선배와의 1:1
            매칭을 통해 SIAT 수강생들에게 실질적인 진로·기술 조언을 제공합니다
          </p>

          <section id="mentoring-list" className="section trainers">
            <div className="container">
              <div className="row gy-5">
                {mentors.map((mentor, index) => (
                  <div
                    key={index}
                    className="col-lg-4 col-md-6 member"
                    data-aos="fade-up"
                    data-aos-delay={100 * (index + 1)}
                  >
                    {/* ---------- 프로필 이미지 ---------- */}
                    <div
                      className="member-img"
                      style={{
                        width: '100%',
                        maxWidth: '250px',
                        margin: '0 auto',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                        const img = e.currentTarget.querySelector('img');
                        if (img) img.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        const img = e.currentTarget.querySelector('img');
                        if (img) img.style.transform = 'scale(1)';
                      }}
                      onClick={() => handleMentorClick(mentor)}
                    >
                      <div
                        style={{
                          width: '100%',
                          paddingBottom: '100%',
                          position: 'relative',
                          borderRadius: '50%',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={mentor.mentorImageUrl}
                          className="img-fluid"
                          alt={mentor.mentorName}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            transform: 'scale(1)',
                            transformOrigin: 'center center',
                            transition: 'transform 0.3s ease',
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/img/team/team-1.jpg'; // 기본 이미지
                          }}
                        />
                      </div>
                    </div>

                    {/* ---------- 텍스트 정보 ---------- */}
                    <div className="member-info text-center">
                      <h4>{mentor.mentorName}</h4>
                      <p>{mentor.position}</p>
                      <p>{mentor.company}</p>
                    </div>
                  </div>
                ))}
              </div>
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

export default MentoringList;

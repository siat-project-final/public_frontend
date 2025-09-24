import React, { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getReviewSubjects } from '../../../api/challenge';
import '../../../App.css';

const ReviewMain = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('복습 과목 목록 불러오는 중...');
      getReviewSubjects()
        .then(res => {
          console.log('복습 과목 목록...');
          setSubjects(res.data);
        })
        .catch(err => console.error('과목 불러오기 실패:', err));
    };

    fetchData();
  }, []);

  const handleSelect = (subject) => {
    navigate('/challenge/review/solve', { state: { subject } });
  };

  // ✨ 공휴일 제외 필터 함수
  const isHoliday = (name) =>
    [
      '임시공휴일',
      '설날연휴',
      '삼일절',
      '부처님 오신날',
      '어린이날',
      '노동절',
      '사회성 훈련',
      '현충일',
      '이력서 작성법 및 면접 요령',
      '직업기초',
      '최종Project',
      '면접 교육',
      '모의 면접',
      '모의면접',
      '직장 예절 & 커뮤니케이션',
      '노동법 등',
      '자율학습',
      '조직문화'
    ].includes(name);

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
                종합챌린지
              </h1>
            </div>
            <p
              className="text-muted"
              style={{ fontSize: '20px', marginLeft: '16px', marginTop: '10px' }}
            >
              100% 학습한 과목만 복습에 참여할 수 있어요.
            </p>
          </div>

          <section className="section">
            <div className="container">
              <div className="row gy-4 justify-content-center">
                {subjects
                  .filter((subject) => !isHoliday(subject.subject)) // ✅ 공휴일 제외
                  .map((subject) => (
                    <div
                      key={subject.id}
                      className="col-lg-4 col-md-6"
                      style={{
                        opacity: subject.progressRate === '100.0' ? 1 : 0.4,
                      }}
                    >
                      <div
                        className={`card h-100 text-center p-4 shadow-sm ${
                          subject.progressRate === '100.0'
                            ? 'bg-white'
                            : 'bg-light'
                        }`}
                        onClick={() =>
                          subject.progressRate === '100.0' &&
                          handleSelect(subject.subject)
                        }
                        style={{
                          cursor:
                            subject.progressRate === '100.0'
                              ? 'pointer'
                              : 'not-allowed',
                        }}
                      >
                        <h5 className="mb-2">{subject.subject}</h5>
                        <p className="mb-0">
                          진도율: {subject.progressRate}%
                        </p>
                        {subject.progressRate !== '100.0' && (
                          <small className="text-danger">
                            아직 완료되지 않은 과목입니다.
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ReviewMain;

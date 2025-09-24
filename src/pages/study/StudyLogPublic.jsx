import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { Link } from 'react-router-dom';
import Todo from '../../components/common/Todo';
import { getPublicStudyLogs, toggleLikeStudyLog } from '../../api/studyLog';

const SUBJECTS = [
  'Java', 'JavaScript', 'Python', 'React', 'AWS', 'CI/CD', 'Springboot', '기타'
];

const StudyLogPublic = () => {
  const [studyLogs, setStudyLogs] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchPublicLogs = async () => {
      try {
        const res = await getPublicStudyLogs();
        setStudyLogs(res.data);

        const likedStates = {};
        res.data.forEach((log) => {
          likedStates[log.diaryId] = localStorage.getItem(`liked-${log.diaryId}`) === 'true';
        });
        setLikedMap(likedStates);
      } catch (err) {
        console.error('공유 일지 조회 실패:', err);
      }
    };
    fetchPublicLogs();
  }, []);

  const handleLike = async (diaryId) => {
    const isLiked = likedMap[diaryId] || false;
    try {
      await toggleLikeStudyLog(diaryId, !isLiked);

      setStudyLogs((prevLogs) =>
        prevLogs.map((log) =>
          log.diaryId === diaryId
            ? { ...log, likeCount: log.likeCount + (isLiked ? -1 : 1) }
            : log
        )
      );
      setLikedMap((prev) => ({ ...prev, [diaryId]: !isLiked }));
      localStorage.setItem(`liked-${diaryId}`, String(!isLiked));
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  // 과목 선택 핸들러
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  // 과목 필터링
  const filteredLogs = selectedSubject
    ? studyLogs.filter((log) => log.subject === selectedSubject)
    : studyLogs;

  return (
    <div>
      <Header />
      <div className="container-flex" style={{ display: 'flex' }}>
        <Sidebar menuType="studylog" />
        <main className="main" style={{ flex: 1 }}>
          <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1
                className="h3 fw-bold mb-0"
                style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
              >
                공유 학습일지
              </h1>
              <div className="d-flex align-items-center">
                <select
                  className="form-select w-auto d-inline-block me-2"
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                >
                  <option value="">전체 과목</option>
                  {SUBJECTS.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
                <Link
                  to="../study/write"
                  className="btn border-0 text-white"
                  style={{ backgroundColor: '#84cc16' }}
                >
                  일지 작성하기
                </Link>
              </div>
            </div>

            {filteredLogs.map((log) => (
              <div key={log.diaryId} className="studylog-boxes card mb-4" data-aos="fade-up">
                <div className="card-body">
                  <h5 className="fw-bold">{log.title}</h5>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <span className="badge bg-secondary me-2">{log.studyDate}</span>
                      <strong>{log.subject}</strong>
                      <span className="text-muted ms-3">NAME: {log.memberName}</span>
                    </div>
                    <div>
                      <button
                        className={`btn ${likedMap[log.diaryId] ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleLike(log.diaryId)}
                      >
                        <i className={`bi ${likedMap[log.diaryId] ? 'bi-heart-fill' : 'bi-heart'}`}></i>{' '}
                        {log.likeCount}
                      </button>
                    </div>
                  </div>
                  <p>{log.aiSummary}</p>
                  <div className="text-end">
                    <Link
                      to={`/study/public/${log.diaryId}`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      상세 보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default StudyLogPublic;
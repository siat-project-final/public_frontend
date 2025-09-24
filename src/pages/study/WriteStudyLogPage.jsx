import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import Todo from '../../components/common/Todo';
import { postStudyLog, summarizeContent } from '../../api/studyLog';

const SUBJECTS = ['Java', 'JavaScript', 'Python', 'React', 'AWS', 'CI/CD', 'Springboot', '기타'];

const WriteStudyLogPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDate = queryParams.get('date') || ''; // URL에 date 있으면 세팅

  const [form, setForm] = useState({
    title: '',
    isPublic: true,
    date: initialDate,
    subject: '',
    content: '',
    summary: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const memberId = localStorage.getItem('memberId');
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0]; // 🔥 오늘 날짜 제한용

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSummary = async () => {
    alert('AI 요약을 실행합니다. 잠시 기다려주세요...');
    setIsLoading(true);
    try {
      const res = await summarizeContent(form.content.replace(/\n/g, ''));
      setForm((prev) => ({ ...prev, summary: res.data.result.replace(/\\n/g, '\n') }));
      alert('AI 요약이 완료되었습니다. 결과를 확인해주세요.');
    } catch (err) {
      console.error('요약 실패:', err);
      alert('요약에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      isPublic: form.isPublic === 'true' || form.isPublic === true,
      memberId,
    };
    console.log('📤 전송 데이터:', data);
    postStudyLog(data)
      .then(() => {
        alert('학습일지가 작성되었습니다.');
        navigate('/study');
      })
      .catch(() => {
        alert('학습일지 작성에 실패했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <div>
      <Header />
      <div className="container-flex" style={{ display: 'flex' }}>
        <Sidebar menuType="studylog" />
        <main className="main">
          <div className="container py-5">
            <h1
              className="h3 fw-bold mb-0"
              style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}
            >
              학습일지 작성
            </h1>
            <div className="studylog-boxes card p-4" data-aos="fade-up">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">학습일지 제목</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="제목 입력"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">과목</label>
                    <select
                      className="form-select"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">과목 선택</option>
                      {SUBJECTS.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">공개 여부</label>
                    <select
                      className="form-select"
                      name="isPublic"
                      value={form.isPublic}
                      onChange={handleChange}
                    >
                      <option value="true">공개</option>
                      <option value="false">비공개</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">날짜</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      max={todayStr} // 🔥 오늘까지 선택 가능
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">학습일지 내용</label>
                  <textarea
                    className="form-control"
                    name="content"
                    rows="9"
                    value={form.content}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-3" style={{ position: 'relative' }}>
                  <label className="form-label">AI 요약</label>
                  <textarea
                    className="form-control"
                    name="summary"
                    rows="7"
                    onChange={handleChange}
                    value={form.summary}
                    style={{ position: 'relative', zIndex: 1 }}
                  ></textarea>

                  {isLoading && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '32px',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2,
                        borderRadius: '4px',
                      }}
                    >
                      <div
                        className="spinner-border text-success"
                        role="status"
                        style={{ width: '1.5rem', height: '1.5rem' }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-3">
                  <button type="button" className="btn btn-secondary" onClick={handleSummary}>
                    AI 요약 실행
                  </button>
                  <button
                    type="submit"
                    className="btn border-0 text-white"
                    style={{ backgroundColor: '#84cc16' }}
                  >
                    제출
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default WriteStudyLogPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import { getMyStudyLogById, updateStudyLog } from '../../api/studyLog';

const StudyLogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const memberId = sessionStorage.getItem('memberId');

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    contents: '',
    summary: '',
    selectedPeriods: [],
  });
  const [originalData, setOriginalData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await getMyStudyLogById(id);
        console.log('🔥 백엔드 응답:', JSON.stringify(res.data, null, 2));

        const initialData = {
          title: res.data.title,
          subject: res.data.subject,
          date: res.data.studyDate?.split(' ')[0],
          contents: res.data.contents,
          summary: res.data.aiSummary,
          selectedPeriods: res.data.selectedPeriods || [],
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } catch {
        alert('해당 일지를 불러올 수 없습니다.');
        navigate('/study');
      }
    };
    fetchLog();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePeriodChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentPeriods = prev.selectedPeriods || [];
      if (checked) {
        return {
          ...prev,
          selectedPeriods: [...currentPeriods, value],
        };
      } else {
        return {
          ...prev,
          selectedPeriods: currentPeriods.filter((period) => period !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      title: formData.title,
      contents: formData.contents,
      subject: formData.subject,
      studyDate: formData.date, // ✅ 필드명 맞추기
      aiSummary: formData.summary, // ✅ 백엔드 필드명
      memberId: parseInt(memberId),
      selectedPeriods: formData.selectedPeriods,
    };
    try {
      await updateStudyLog(id, updateData);
      localStorage.setItem(`selectedPeriods_${id}`, JSON.stringify(formData.selectedPeriods));
      setOriginalData(formData);
      setIsEditMode(false);
      alert('수정이 완료되었습니다.');
    } catch (err) {
      console.error('일지 수정 실패:', err);
      alert('수정 실패');
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditMode(false);
  };

  return (
    <div>
      <Header />
      <div className="container-flex" style={{ display: 'flex' }}>
        <Sidebar menuType="studylog" />
        <main className="main">
          <div className="container py-5">
            <div className="d-flex align-items-center justify-content-between flex-nowrap mb-4">
              <h3
                className="fw-bold mb-0"
                style={{
                  color: '#84cc16',
                  whiteSpace: 'nowrap',
                  marginTop: '16px',
                  marginLeft: '16px',
                }}
              >
                학습일지 상세
              </h3>
            </div>
            <div className="studylog-boxes">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">학습일지 제목</label>
                    <input
                      name="title"
                      type="text"
                      className="form-control"
                      value={formData.title || ''}
                      onChange={handleChange}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                      {['하루', '일주일', '한 달', '세 달'].map((period) => (
                        <div key={period} className="form-check form-check-inline m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`header-checkbox-${period}`}
                            value={period}
                            checked={formData.selectedPeriods.includes(period)}
                            onChange={handlePeriodChange}
                            disabled={!isEditMode}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`header-checkbox-${period}`}
                            style={{ fontSize: '0.9rem' }}
                          >
                            {period}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row mb-3 align-items-end">
                  <div className="col-md-6">
                    <label className="form-label">과목</label>
                    <input
                      name="subject"
                      type="text"
                      className="form-control"
                      value={formData.subject || ''}
                      onChange={handleChange}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">공개 여부</label>
                    <select className="form-select" disabled>
                      <option>공개</option>
                      <option>비공개</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">날짜</label>
                    <input
                      name="date"
                      type="date"
                      className="form-control"
                      value={formData.date || ''}
                      onChange={handleChange}
                      readOnly={!isEditMode}
                      max={todayStr}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">학습일지 내용</label>
                  <textarea
                    name="contents"
                    className="form-control"
                    rows="10"
                    value={formData.contents || ''}
                    onChange={handleChange}
                    readOnly={!isEditMode}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">AI 요약</label>
                  <textarea
                    name="summary"
                    className="form-control"
                    rows="7"
                    value={formData.summary || ''}
                    readOnly
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end gap-3">
                  {!isEditMode ? (
                    <button
                      type="button"
                      className="btn border-0 text-white"
                      style={{ backgroundColor: '#84cc16' }}
                      onClick={(e) => {
                        e.preventDefault();
                        setTimeout(() => {
                          setIsEditMode(true);
                        }, 0);
                      }}
                    >
                      수정하기
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="btn border-0 text-white"
                        style={{ backgroundColor: '#84cc16' }}
                      >
                        수정 완료
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        취소
                      </button>
                    </>
                  )}
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

export default StudyLogDetailPage;

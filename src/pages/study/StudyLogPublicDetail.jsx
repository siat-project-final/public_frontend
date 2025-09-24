import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { useParams } from 'react-router-dom';
import Todo from '../../components/common/Todo';
import instance from '../../api/axios';
import {
  getPublicStudyLogDetail,
  toggleLikeStudyLog,
  updateStudyLogComment,
  deleteStudyLogComment
} from '../../api/studyLog';

const StudyLogPublicDetail = () => {
  const { id } = useParams(); // diaryId
  const [log, setLog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(prev => (prev === index ? null : index));
  };

  const fetchDetail = async () => {
    try {
      const res = await getPublicStudyLogDetail(id);
      setLog(res.data);
      const liked = localStorage.getItem(`liked-${res.data.diaryId}`) === 'true';
      setIsLiked(liked);
    } catch (err) {
      console.error('공유 학습일지 상세 조회 실패:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await instance.get(`/study-diary/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    const memberId = sessionStorage.getItem('memberId');
    if (!memberId) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    try {
      await instance.post('/study-diary/comments', {
        diaryId: id,
        memberId: parseInt(memberId),
        contents: commentText,
      });
      setCommentText('');
      fetchComments();
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };

  const handleLike = async () => {
    if (!log) return;
    try {
      await toggleLikeStudyLog(log.diaryId, !isLiked);
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      localStorage.setItem(`liked-${log.diaryId}`, String(newLiked));
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleEditClick = (index, content) => {
    setEditIndex(index);
    setEditContent(content);
    setOpenDropdownIndex(null);
  };

  const handleEditSubmit = async (commentId) => {
    try {
      const memberId = sessionStorage.getItem('memberId');
      if (!memberId) {
        alert('로그인이 필요합니다.');
        return;
      }
  
      // console.log("수정 요청 commentId:", commentId);
      // console.log("memberId:", memberId);
      // console.log("contents:", editContent);
  
      await updateStudyLogComment(commentId, parseInt(memberId), editContent);
      setEditIndex(null);
      fetchComments();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      if (err.response) {
        console.error('응답 상태:', err.response.status);
        console.error('응답 데이터:', err.response.data);
      }
    }
  };
  
  
  const handleStartEdit = (index, content, commentId) => {
    setEditIndex(index);
    setEditContent(content);
    setSelectedCommentId(commentId);
    setOpenDropdownIndex(null);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const memberId = sessionStorage.getItem('memberId');
      if (!memberId) {
        alert('로그인이 필요합니다.');
        return;
      }
  
      const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
      if (!confirmDelete) return;
  
      await deleteStudyLogComment(commentId, parseInt(memberId));
      fetchComments();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };
  
    

  if (!log) return <div>로딩 중...</div>;

  return (
    <div>
      <Header />
      <div className="container-flex" style={{ display: 'flex' }}>
        <Sidebar menuType="studylog" />
        <main className="main" style={{ flex: 1 }} data-aos="fade-up">
          <div className="container py-5">
            <h1 className="h3 fw-bold mb-4" style={{ marginTop: '16px', marginLeft: '16px', color: '#84cc16' }}>
              공유 학습일지 상세
            </h1>

            <div className="card mb-3 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <input className="form-control w-50" value={log.title} disabled style={{ backgroundColor: 'white' }} />
                <div className="d-flex align-items-center">
                  {log.memberName && <span className="me-2">작성자: {log.memberName}</span>}
                  <button
                    className={`btn ${isLiked ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={handleLike}
                  >
                    <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i> {log.likeCount}
                  </button>
                </div>
              </div>
              <div className="d-flex gap-3 mb-3">
                <input className="form-control" value={log.studyDate} disabled style={{ backgroundColor: 'white' }} />
                <input className="form-control" value={log.subject} disabled style={{ backgroundColor: 'white' }} />
              </div>
              <textarea
                className="form-control mb-3"
                value={log.contents}
                rows="6"
                disabled
                style={{ backgroundColor: 'white' }}
              />
            </div>

            <div className="mb-4">
  <h6 className="fw-bold mb-4">등록된 댓글</h6>
  {comments.map((c, i) => {
    // console.log(`index ${i}의 댓글`, c); // ✅ 콘솔 찍기

    return (
      <div
        key={i}
        className="border rounded p-2 mb-2 d-flex justify-content-between"
        style={{ position: 'relative' }}
      >
        {/* 왼쪽: 댓글 수정 중일 때와 아닐 때 분기 */}
        {editIndex === i ? (
          <div className="ps-3" style={{ flex: 1 }}>
            <strong>{c.memberName}</strong>
            <div className="d-flex align-items-center mt-2">
              <input
                className="form-control"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{ minWidth: '0', flex: 1, marginRight: '10px' }}
              />
              <div className="d-flex flex-column align-items-end" style={{ minWidth: '80px' }}>
                <button
                  className="btn btn-sm mb-1"
                  onClick={() => setEditIndex(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    fontSize: '0.75rem',
                    padding: '0',
                    border: 'none',
                    marginRight: '20px'
                  }}
                >
                  취소
                </button>
                <button
                  className="btn btn-sm text-white"
                  style={{ backgroundColor: '#84cc16', border: 'none' }}
                  onClick={() => handleEditSubmit(c.commentId)}
                >
                  수정 완료
                </button>
              </div>
            </div>
            <small className="text-muted mt-1 d-block">
              {c.date ? new Date(c.date).toLocaleDateString() : ''}
            </small>
          </div>
        ) : (
          <div className="ps-3" style={{ flex: 1 }}>
            <strong>{c.memberName}</strong>
            <p className="mb-1 mt-2">{c.contents}</p>
            <small className="text-muted">
              {c.date ? new Date(c.date).toLocaleDateString() : ''}
            </small>
          </div>
        )}

        {/* 오른쪽: 더보기 버튼 */}
        {editIndex !== i && (
          <div className="ms-3 d-flex align-items-start" style={{ paddingRight: '12px' }}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/img/ellipsis-vertical.png`}
              alt="더보기"
              style={{ marginTop: '20px', width: '20px', height: '20px', cursor: 'pointer' }}
              onClick={() => handleToggleDropdown(i)}
            />
          </div>
        )}

        {/* 드롭다운 메뉴 */}
        {openDropdownIndex === i && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '12px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 100,
            }}
          >
            <button
              className="dropdown-item"
              onClick={() => handleStartEdit(i, c.contents, c.commentId)}
              style={{ padding: '8px 12px', width: '100%', border: 'none', background: 'white' }}
            >
              수정
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleDeleteComment(c.commentId)}
              style={{ padding: '8px 12px', width: '100%', border: 'none', background: 'white' }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    );
  })}

          {/* 댓글 입력 */}
          <div className="d-flex align-items-center mt-3">
            <input
              type="text"
              placeholder="댓글을 남겨보세요"
              className="form-control me-2 flex-grow-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="btn border-0 text-white flex-shrink-0"
              style={{ backgroundColor: '#84cc16' }}
              onClick={handleCommentSubmit}
            >
              등록
            </button>
          </div>
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

export default StudyLogPublicDetail;

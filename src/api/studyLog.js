import axios from './axios'; 

/** 내 학습일지 전체 조회 */
export const getMyStudyLogs = (memberId) => {
  return axios.get(`/study-diary/member/${memberId}`);
};

/** 내 학습일지 단건 조회 */
export const getMyStudyLogById = (diaryId) => {
  return axios.get(`/study-diary/${diaryId}`);
};

/** 학습일지 작성 */
export const postStudyLog = (data) => {
  return axios.post('/study-diary', data);
};

/** 학습일지 수정 */
export const updateStudyLog = (diaryId, data) => {
  return axios.put(`/study-diary/${diaryId}`, data);
};

/** 학습일지 삭제 */
export const deleteStudyLog = (diaryId, memberId) => {
  return axios.delete(`/study-diary/${diaryId}`, {
    params: { memberId },
  });
};

/** AI 요약 생성 */
export const summarizeContent = (content) => {
  return axios.post('/study-diary/ai-summary', { text : content });
};

/** 공개 학습일지 전체 조회 */
export const getPublicStudyLogs = () => {
  return axios.get('/study-diary/public');
};

/** 공개 학습일지 단건 조회 */
export const getPublicStudyLogDetail = async (id) => {
  return axios.get(`/study-diary/${id}`);
};

/** 좋아요 토글 (등록/취소) */
export const toggleLikeStudyLog = (diaryId, isLike) => {
  return axios.put(`/study-diary/like/${diaryId}?isLike=${isLike}`);
};


/** 댓글 작성 */
export const commentOnStudyLog = (diaryId, memberId, contents) => {
  return axios.post(`/study-diary/${diaryId}/comments`, {
    memberId,
    contents,
  });
};

/** 댓글 수정 */
export const updateStudyLogComment = (commentId, memberId, contents) => {
  return axios.put(`/study-diary/comments/${commentId}`, {
    memberId,
    contents,
  });
};

/** 댓글 삭제 */
export const deleteStudyLogComment = (commentId, memberId) => {
  return axios.put(`/study-diary/comments/${commentId}/delete`, {
    memberId,
  });
};

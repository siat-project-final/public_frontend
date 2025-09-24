import axios from './axios';

/** 오늘의 챌린지 문제 조회 */
export const getTodayChallenge = () => {
  return axios.get('/challenge');
};

/** 챌린지 문제 제출 */
export const submitChallenge = ({ memberId, problemIds, answers, createdAt }) => {
  return axios.post('/challenge', {
    memberId,
    problemIds,
    answers,
    createdAt,
  });
};

/** 챌린지 히스토리 전체 조회 */
export const getChallengeHistory = (memberId) => {
  return axios.get(`/myPage/history/challenge/${memberId}`);
};

/** 챌린지 히스토리 상세 조회 */
export const getChallengeHistoryByDate = (date) => {
  return axios.get(`/challenges/history/${date}`);
};

/** 일일 랭킹 조회 */
export const getDailyRanking = (date) => {
  return axios.get('/challenge/rank', {
    params: { date },
  });
};

/** 챌린지 참여 여부 확인 */
export const checkParticipation = (memberId, date) => {
  return axios.get('/challenge/participation', {
    params: { memberId, date },
  });
};
/** 채점 결과 조회 */
export const getSubmissionResult = (memberId, date) => {
  return axios.get(`/challenge/${memberId}/scoring`, {
    params: { date }
  });
};

/** 복습 과목 목록 조회 */
export const getReviewSubjects = () => {
  return axios.get('/challenge/review');
};

/** 복습 문제 랜덤 조회 */
export const getReviewProblems = (memberId, subject) => {
  return axios.get(`/challenge/review/${memberId}/${subject}`, {
  });
};


// 주요 요청 예시
// /api/challenges/questions?userId=5

// /api/challenges/submit { problemId: 1, memberId: 5, submitAnswer: "B" }

// /api/submissions/check?memberId=5&date=2025-06-19
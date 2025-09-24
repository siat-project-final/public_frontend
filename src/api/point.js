import axios from 'axios';

// 누적 포인트 (총점)
export const getTotalPoints = (memberId) =>
  axios.get(`/api/point/total?memberId=${memberId}`);

// 오늘 획득한 포인트
export const getTodayPoints = (memberId) =>
  axios.get(`/api/point/today?memberId=${memberId}`);

// 포인트 상세 이력 (필요할 경우)
export const getPointHistory = (memberId) =>
  axios.get(`/api/point/history?memberId=${memberId}`);

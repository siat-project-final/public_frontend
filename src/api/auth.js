import axios from './axios';

/** 회원가입 */
export const signUp = (data) => {
  return axios.post('/auth/signup', data);
};

/** 로그인 */
export const signIn = ({ id, password }) => {
  return axios.post('/auth/login', { id, password });
};

/** 로그아웃 */
export const logout = () => {
  return axios.post('/auth/logout');
};

/** 토큰 재발급 */
export const reissueToken = (refreshToken) => {
  return axios.post('/auth/reissue', { refreshToken });
};

/** 멘토 ID 조회 (MENTOR 전용) */
export const getMentorIdByMemberId = (memberId) => {
  return axios.get(`/auth/mentor-id`, {
    params: { memberId },
  });
};

// 요청 예시
// POST /api/auth/login { id: 'choi123', password: '1234' }

// POST /api/auth/reissue { refreshToken: '...' }
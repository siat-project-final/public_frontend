import axios from './axios';

/** 회원 정보 조회 */
export const getUserInfo = (memberId) => {
  return axios.get(`/myPage/members/${memberId}`);
};

/** 회원 정보 수정 */
export const updateUserInfo = (memberId, data) => {
  return axios.put(`/myPage/members/${memberId}`, data);
};

/** 비밀번호 변경 */
export const changePassword = (memberId, currentPassword, newPassword) => {
  return axios.put(`/users/${memberId}/password`, {
    currentPassword,
    newPassword,
  });
};

/** 통계 정보 조회 */
export const getUserStats = (memberId) => {
  return axios.get(`/myPage/members/${memberId}/stats`);
};

/** 프로필 이미지 업로드 */
export const uploadProfileImage = (memberId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`/users/${memberId}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/** 멘토링 히스토리 조회 */
export const getMentoringHistory = (memberId) => {
  return axios.get(`/myPage/history/mentoring/${memberId}`);
};

// 요청 예시
// PUT /api/users/3/password { currentPassword: "1234", newPassword: "5678" }

// POST /api/users/3/profile-image → form-data로 전송
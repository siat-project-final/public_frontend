// JWT 토큰 저장
export const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

// JWT 토큰 가져오기
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

// JWT 토큰 삭제
export const removeToken = () => {
  localStorage.removeItem('accessToken');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

// 인증 상태 확인
export const isAuthenticated = () => {
  return !!getToken();
};

// API 요청 헤더에 토큰 추가
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const setRefreshToken = (token) => {
  localStorage.setItem('refreshToken', token);
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const removeRefreshToken = () => {
  localStorage.removeItem('refreshToken');
};

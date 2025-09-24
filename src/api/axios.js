import axios from 'axios';

// const instance = axios.create({
//  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8087/v1',
//  withCredentials: true,
// });

const instance = axios.create({
  baseURL: 'https://api.siathub.com/v1',
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 선택: 응답 에러 처리도 추가해두면 좋음
instance.interceptors.response.use(
  res => res,
  err => {

    // 요청 config에서 URL 추출
    const reqUrl = err.config?.url;

    // 로그인/회원가입 요청이면 패스(401이어도 세션 만료 처리 X)
    if (reqUrl && reqUrl.includes('/auth')) {
      return Promise.reject(err);
    }

    if (err.response && err.response.status === 401) {
      alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default instance;

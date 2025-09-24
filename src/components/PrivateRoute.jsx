import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

function PrivateRoute({ children }) {
  const isAuth = isAuthenticated();
  const location = useLocation();

  // 로그인 or 회원가입 직후면 무조건 통과
  if (location.state?.fromLogin || location.state?.fromSignUp) {
    return children;
  }

  // 그 외에는 인증 체크
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;

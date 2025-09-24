import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import instance from '../api/axios'; // Axios 인스턴스
import { signIn } from '../api/auth'; // 로그인 API

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await signIn({ id, password });
      if (response.status === 200) {
        const { accessToken, refreshToken, memberId, id, memberName, role } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('memberId', memberId);
        localStorage.setItem('id', id);
        localStorage.setItem('memberName', memberName);
        localStorage.setItem('role', role);

        if (role === 'MENTOR') {
          try {
            const mentorRes = await instance.get(`/auth/mentor-id?memberId=${memberId}`);
            localStorage.setItem('mentorId', mentorRes.data);
            console.log('✅ mentorId 저장 완료:', mentorRes.data);
          } catch (err) {
            console.error('❌ mentorId 조회 실패:', err);
          }
        }

        sessionStorage.setItem('memberId', memberId);
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('memberName', memberName);

        navigate('/home', { state: { fromLogin: true } });
      }
    } catch (error) {
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">     
          <img
          src="/assets/img/mentors/siatlogo.png"
          alt="SIAT Logo"
          style={{ 
            width: '300px', 
            height: '200px',
            maxHeight: '200px',
            display: 'block',
            marginLeft: '100px'
          }}/>
        </h1>
        <form onSubmit={loginHandler} style={{ borderRadius: '4%', padding: '30px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div className="form-group">
            <label htmlFor="id" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                아이디&nbsp;
                <span>(임시 게스트 계정 : guest/1234)</span>
            </label>
            <input
              id="id"
              type="text" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ fontWeight: 'bold', fontSize: '15px' }}>비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div className="button-group" style={{ marginTop: '3rem' }}>
            <button className="login-button primary" type="submit">
              로그인
            </button>
            <button
              className="login-button secondary"
              type="button"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../api/axios';
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    memberName: '',
    email: '',
    phoneNumber: '',
    nickname: '',
    role: 'USER',
    status: 'ACTIVE',
    total_xp: 0,
    usable_points: 0,
    current_level: 1,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isValidId = (id) => /^[a-z0-9]{5,20}$/.test(id);
  const isValidPassword = (pw) =>
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:"<>?]).{8,20}$/.test(pw);

  const signUpHandler = async (event) => {
    event.preventDefault();

    if (!isValidId(formData.id)) {
      alert('아이디는 영문 소문자와 숫자 조합 5~20자여야 합니다.');
      return;
    }

    if (!isValidPassword(formData.password)) {
      alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const signUpData = {
      id: formData.id,
      password: formData.password,
      memberName: formData.memberName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      nickname: formData.nickname?.trim() || formData.memberName, // ✅ 비었으면 이름으로 대체
      role: formData.role,
      status: formData.status,
      total_xp: formData.total_xp,
      usable_points: formData.usable_points,
      current_level: formData.current_level,
    };

    if (formData.id === 'mock' && formData.password === '1234') {
      alert('회원가입이 완료되었습니다. (mock)');
      navigate('/', { state: { fromSignUp: true } });
      return;
    }

    instance
      .post('/auth/signUp', signUpData)
      .then((response) => {
        if (response.status === 200) {
          alert('회원가입이 완료되었습니다.');
          navigate('/login');
        }
      })
      .catch((error) => {
        if (error.response) {
          const status = error.response.status;
          const msg = error.response.data?.message || '';

          if (status === 401) {
            alert('SIAT 수강생이 아닙니다.');
          } else if (msg.includes('id') || msg.includes('아이디')) {
            alert('이미 사용 중인 아이디입니다.');
          } else if (msg.includes('nickname')) {
            alert('이미 사용 중인 닉네임입니다.');
          } else {
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
          }
        } else {
          alert('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
        }
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">회원가입</h1>
        <form onSubmit={signUpHandler}>
          <div className="form-group">
            <label className="form-label" htmlFor="id">
              아이디 <span className="label-hint">(영문 소문자 + 숫자, 5~20자)</span>
            </label>
            <input
              className="form-input"
              id="id"
              name="id"
              type="text"
              value={formData.id}
              onChange={handleChange}
              required
            />
            {/* <p className="form-hint">영문 소문자 + 숫자, 5~20자</p> */}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              비밀번호 <span className="label-hint">(영문, 숫자, 특수문자 포함 8~20자)</span>
            </label>
            <input
              className="form-input"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {/* <p className="form-hint">영문, 숫자, 특수문자 포함 8~20자</p> */}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="passwordConfirm">
              비밀번호 확인
            </label>
            <input
              className="form-input"
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="memberName">
              이름 <span className="label-hint">(2~20자, 한글 또는 영문)</span>
            </label>
            <input
              className="form-input"
              id="memberName"
              name="memberName"
              type="text"
              value={formData.memberName}
              onChange={handleChange}
              required
            />
            {/* <p className="form-hint">2~20자, 한글 또는 영문</p> */}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="nickname">
              닉네임{' '}
              <span className="label-hint">
                (한글/영문/숫자 조합, 2~20자 <span style={{ fontWeight: 400 }}>(선택)</span>)
              </span>
            </label>
            <input
              className="form-input"
              id="nickname"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
            />
            {/* <p className="form-hint">한글/영문/숫자 조합, 2~20자 (선택)</p> */}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              이메일 <span className="label-hint">(예: example@domain.com)</span>
            </label>
            <input
              className="form-input"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {/* <p className="form-hint">예: example@domain.com</p> */}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">
              휴대폰 번호 <span className="label-hint">(예: 01012345678)</span>
            </label>
            <input
              className="form-input"
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            {/* <p className="form-hint">예: 01012345678</p> */}
          </div>

          <button className="signup-button" type="submit">
            가입하기
          </button>
        </form>
        <a className="login-link" href="/login" onClick={() => navigate('/')}>
          이미 계정이 있으신가요? 로그인
        </a>
      </div>
    </div>
  );
}

export default SignUp;

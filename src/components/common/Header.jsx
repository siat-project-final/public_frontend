import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItemStyle = {
  fontSize: '18px',
  padding: '8px 12px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '170px',
  display: 'block',
  borderBottom: 'none',
};

const Header = ({ menuType }) => {
  const role = localStorage.getItem('role');

  const mentoringMenuItems = [
    {
      label: '멘토 목록',
      to: '/mentoring/mentors',
    },
    {
      label: '예약 내역',
      to: role === 'MENTOR' ? '/mentoring/mentor/register' : '/mentoring/register',
    },
  ];

  return (
    <>
      <style>
        {`
          .dropdown-item.active,
          .dropdown-item:active {
            background-color: #f0fdf4 !important;
          }
        `}
      </style>

      <header id="header" className="header d-flex align-items-center sticky-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <div className="me-auto" style={{ width: '180px', height: '50px', flexShrink: 0 }}></div>

          <NavLink
            to="/"
            className="d-flex align-items-center"
            style={{
              position: 'absolute',
              left: '15px',
              top: '60%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <img
              src="/assets/img/mentors/siatlogo.png"
              alt="SIAT Logo"
              style={{ width: '200px', height: '120px', maxHeight: '120px', display: 'block' }}
            />
          </NavLink>

          <nav id="navmenu" className="navmenu">
            <ul style={{ gap: window.innerWidth >= 1200 ? '3rem' : undefined }}>
              <li className="dropdown">
                <NavLink
                  to="/home"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  style={({ isActive }) => ({
                    fontSize: '1.2rem',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  Home
                </NavLink>
              </li>

              <li className="dropdown">
                <NavLink
                  to="/challenge"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  style={({ isActive }) => ({
                    fontSize: '1.2rem',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  Challenge
                </NavLink>
                <ul
                  className="dropdown-menu"
                  style={{
                    marginTop: '28px',
                    left: '-30px',
                    top: '50%',
                    maxWidth: '170px',
                    padding: 0,
                  }}
                >
                  <li>
                    <NavLink to="/challenge/daily" className="dropdown-item" style={menuItemStyle}>
                      일일 챌린지
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/challenge/ranking"
                      className="dropdown-item"
                      style={menuItemStyle}
                    >
                      챌린지 랭킹
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/challenge/review" className="dropdown-item" style={menuItemStyle}>
                      종합 챌린지
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/mypage/challenge-history"
                      className="dropdown-item"
                      style={menuItemStyle}
                    >
                      챌린지 히스토리
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="dropdown">
                <NavLink
                  to="/mentoring/mentors"
                  className={({ isActive }) =>
                    isActive || menuType === 'mentoring' ? 'active' : ''
                  }
                  style={({ isActive }) => ({
                    fontSize: '1.2rem',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  Mentoring
                </NavLink>
                <ul
                  className="dropdown-menu"
                  style={{
                    marginTop: '28px',
                    left: '-28px',
                    top: '50%',
                    maxWidth: '170px',
                    padding: 0,
                  }}
                >
                  {mentoringMenuItems.map((item) => (
                    <li key={item.label}>
                      <NavLink to={item.to} className="dropdown-item" style={menuItemStyle}>
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="dropdown">
                <NavLink
                  to="/study"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  style={({ isActive }) => ({
                    fontSize: '1.2rem',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  Studylog
                </NavLink>
                <ul
                  className="dropdown-menu"
                  style={{
                    marginTop: '28px',
                    left: '-35px',
                    top: '50%',
                    maxWidth: '170px',
                    padding: 0,
                  }}
                >
                  <li>
                    <NavLink to="/study" end className="dropdown-item" style={menuItemStyle}>
                      학습 일지 목록
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/study/write" className="dropdown-item" style={menuItemStyle}>
                      학습 일지 작성
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/study/public" className="dropdown-item" style={menuItemStyle}>
                      공유 학습 일지
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="dropdown">
                <NavLink
                  to="/shop"
                  className={({ isActive }) => (isActive || menuType === 'shop' ? 'active' : '')}
                  style={({ isActive }) => ({
                    fontSize: '1.2rem',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  Shop
                </NavLink>
                <ul
                  className="dropdown-menu"
                  style={{
                    marginTop: '28px',
                    left: '-30px',
                    top: '50%',
                    maxWidth: '170px',
                    padding: 0,
                  }}
                >
                  <li>
                    <NavLink to="/shop" className="dropdown-item" style={menuItemStyle}>
                      스티커 상점
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/inventory" className="dropdown-item" style={menuItemStyle}>
                      내 인벤토리
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="dropdown">
                <NavLink
                  to="/mypage"
                  className={({ isActive }) => (isActive || menuType === 'mypage' ? 'active' : '')}
                  style={({ isActive }) => ({
                    fontSize: '1.2rem',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  MyPage
                </NavLink>
                <ul
                  className="dropdown-menu"
                  style={{
                    marginTop: '28px',
                    left: '-38px',
                    top: '50%',
                    maxWidth: '170px',
                    padding: 0,
                  }}
                >
                  <li>
                    <NavLink to="/mypage" end className="dropdown-item" style={menuItemStyle}>
                      마이 프로필
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/mypage/badges" className="dropdown-item" style={menuItemStyle}>
                      뱃지 목록
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/mypage/mentoring-history"
                      className="dropdown-item"
                      style={menuItemStyle}
                    >
                      멘토링 히스토리
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/mypage/statistics"
                      className="dropdown-item"
                      style={menuItemStyle}
                    >
                      통계
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/mypage/challenge-history"
                      className="dropdown-item"
                      style={menuItemStyle}
                    >
                      챌린지 히스토리
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li
                className="alarm-item"
                style={{ listStyle: 'none', padding: '0', margin: '0', border: 'none' }}
              >
                <NavLink
                  to="/mentee-alarm"
                  style={{
                    color: 'inherit',
                    padding: '0',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    textDecoration: 'none',
                    borderBottom: 'none',
                    transition: 'none',
                  }}
                >
                  <img
                    src="/assets/img/mentors/bell.png"
                    alt="Notifications"
                    style={{ width: '20px', height: '20px', marginLeft: '12px' }}
                  />
                </NavLink>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <NavLink
            className="btn-getstarted"
            to="/login"
            onClick={() => {
              // localStorage에서 삭제
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('memberId');
              localStorage.removeItem('id');
              localStorage.removeItem('memberName');
              localStorage.removeItem('role');
              localStorage.removeItem('mentorId'); // 멘토일 경우

              // sessionStorage에서도 삭제
              sessionStorage.removeItem('memberId');
              sessionStorage.removeItem('userRole');
              sessionStorage.removeItem('memberName');

              console.log('🧹 로그아웃: 저장소 초기화 완료');
            }}
            style={{
              fontSize: '16px',
              color: '#334155',
              backgroundColor: 'white',
              border: '1px solid #334155',
            }}
          >
            <b>Logout</b>
          </NavLink>
        </div>
      </header>
    </>
  );
};

export default Header;

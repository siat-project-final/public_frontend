import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import './MyPageMain.css';
import { getUserInfo, updateUserInfo } from '../../api/user';
import badge1 from '../../assets/img/badges/badge1.png';
import badge2 from '../../assets/img/badges/badge2.png';
import badge3 from '../../assets/img/badges/badge3.png';
import badge4 from '../../assets/img/badges/badge4.png';
import badge5 from '../../assets/img/badges/badge5.png';
import badge6 from '../../assets/img/badges/badge6.png';
import badge7 from '../../assets/img/badges/badge7.png';
import badge8 from '../../assets/img/badges/badge8.png';
import badge9 from '../../assets/img/badges/badge9.png';

const levelBadges = {
  1: badge1,
  2: badge2,
  3: badge3,
  4: badge4,
  5: badge5,
  6: badge6,
  7: badge7,
  8: badge8,
  9: badge9,
};

const MyPageMain = () => {
  const [user, setUser] = useState(null);
  const memberId = localStorage.getItem('memberId');

  const fetchData = async () => {
    try {
      const res = await getUserInfo(memberId);
      setUser(res.data);
      localStorage.setItem('currentLevel', res.data.currentLevel);
    } catch (err) {
      console.error('회원 정보 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [memberId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      id: e.target.id.value,
      password: e.target.password.value,
      memberName: e.target.name.value,
      nickname: e.target.nickname.value,
      phoneNumber: e.target.phone.value,
      email: e.target.email.value,
    };

    try {
      await updateUserInfo(memberId, updatedUser);
      alert('회원 정보가 수정되었습니다.');
      fetchData();
    } catch (err) {
      console.error('회원 정보 수정 실패:', err);
    }
  };

  if (!user) return <div>로딩 중...</div>;

  const levelThresholds = {
    1: 0,
    2: 100,
    3: 200,
    4: 300,
    5: 400,
    6: 500,
    7: 700,
    8: 1000,
    9: 1300,
  };

  const totalXp = user.totalXp;
  const levelEntries = Object.entries(levelThresholds);

  let currentLevel = 1;
  for (let i = 1; i < levelEntries.length; i++) {
    const [level, xp] = levelEntries[i];
    if (totalXp >= xp) currentLevel = parseInt(level);
    else break;
  }

  const currentThreshold = levelThresholds[currentLevel];
  const nextThreshold = levelThresholds[currentLevel + 1] ?? totalXp;
  const levelProgressPercent = Math.min(
    100,
    ((totalXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  );
  const badgeImage = levelBadges[currentLevel];

  return (
    <div>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="mypage" />
        <main className="main">
          <section className="profile-section" data-aos="fade-up">
            <div className="profile-content">
              <div className="profile-left">
                <div className="profile-image">
                  <img src="/assets/img/mentors/mentor1.jpg" />
                </div>
                <div className="profile-stats">
                  <div className="stat-item">
                    <div className="stat-icon">P</div>
                    <p className="stat-value">{user.usablePoints.toLocaleString()}</p>
                  </div>
                  <div className="stat-item">
                    <div className="level-info">
                      <p className="level-value">{currentLevel}</p>
                      <p className="level-label">Level</p>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${levelProgressPercent}%` }}
                        ></div>
                      </div>
                      <p className="xp-value">
                        {totalXp} / {nextThreshold}
                      </p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="badge-info">
                      {badgeImage && (
                        <img
                          src={badgeImage}
                          alt="최근 뱃지"
                          style={{ width: '48px', height: '48px' }}
                        />
                      )}
                      <p className="badge-label">Badges</p>
                    </div>
                  </div>
                </div>
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="id">ID</label>
                  <input id="id" type="text" defaultValue={user.id} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="password">PASSWORD</label>
                  <input id="password" type="password" defaultValue={user.password} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">NAME</label>
                  <input id="name" type="text" defaultValue={user.memberName} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="nickname">NICKNAME</label>
                  <input id="nickname" type="text" defaultValue={user.nickname} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">PHONE</label>
                  <input id="phone" type="text" defaultValue={user.phoneNumber} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="email">EMAIL</label>
                  <input id="email" type="text" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label htmlFor="status">STATUS (수정불가)</label>
                  <input id="status" type="text" defaultValue={user.role} readOnly />
                </div>
                <button className="submit-btn" type="submit">
                  수정하기
                </button>
              </form>
            </div>
          </section>
        </main>
        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default MyPageMain;

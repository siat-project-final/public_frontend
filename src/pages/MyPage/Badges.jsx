import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import './Badges.css';
import { getUserInfo } from '../../api/user';

import badge1 from '../../assets/img/badges/badge1.png';
import badge2 from '../../assets/img/badges/badge2.png';
import badge3 from '../../assets/img/badges/badge3.png';
import badge4 from '../../assets/img/badges/badge4.png';
import badge5 from '../../assets/img/badges/badge5.png';
import badge6 from '../../assets/img/badges/badge6.png';
import badge7 from '../../assets/img/badges/badge7.png';
import badge8 from '../../assets/img/badges/badge8.png';
import badge9 from '../../assets/img/badges/badge9.png';

const Badges = () => {
  const [badgesList, setBadgesList] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [totalXp, setTotalXp] = useState(null);
  const memberId = localStorage.getItem('memberId');

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await getUserInfo(memberId);
        const level = Number(res.data.currentLevel);
        setCurrentLevel(level);
        setTotalXp(res.data.totalXp);
        console.log('현재 레벨:', level);
      } catch (err) {
        console.error('레벨 불러오기 실패:', err);
      }
    };

    if (memberId) {
      fetchLevel();
    }
  }, [memberId]);

  useEffect(() => {
    if (currentLevel === null) return;

    const mockBadges = [
      { id: 1, name: '씨앗', description: '가입 완료', imageUrl: badge1, requiredLevel: 1 },
      { id: 2, name: '새싹', description: '학습 시작', imageUrl: badge2, requiredLevel: 2 },
      { id: 3, name: '성장중', description: '열심히 학습 중', imageUrl: badge3, requiredLevel: 3 },
      { id: 4, name: '묘목', description: '루틴 정착', imageUrl: badge4, requiredLevel: 4 },
      { id: 5, name: '나무', description: '꾸준함의 나무', imageUrl: badge5, requiredLevel: 5 },
      { id: 6, name: '꽃', description: '꽃을 피움', imageUrl: badge6, requiredLevel: 6 },
      { id: 7, name: '열매', description: '열매를 맺음', imageUrl: badge7, requiredLevel: 7 },
      { id: 8, name: '큰 나무', description: '리더의 품격', imageUrl: badge8, requiredLevel: 8 },
      { id: 9, name: '숲의 지혜', description: '지식인', imageUrl: badge9, requiredLevel: 9 }
    ];

    const updated = mockBadges.map(badge => ({
      ...badge,
      achieved: currentLevel >= badge.requiredLevel
    }));

    setBadgesList(updated);
  }, [currentLevel]);

  return (
    <div>
      <Header />
      <div className="container-flex">
        <Sidebar menuType="mypage" />
        <main className="main">
          <section className="badges-section" data-aos="fade-up">
            <h1 className="badge-title">뱃지 목록</h1>
            <div className="badges-grid">
              {badgesList.map(badge => (
                <div
                  key={badge.id}
                  className={`badge-card ${badge.achieved ? 'achieved' : 'locked'}`}
                >
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="badge-image"
                  />
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">
                    {badge.achieved
                      ? badge.description
                      : `${badge.requiredLevel}레벨 해금`}
                  </p>
                </div>
              ))}
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

export default Badges;

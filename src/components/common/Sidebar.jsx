import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/scss/layouts/_sidebar.scss';

const menuMap = {
  mentoring: {
    title: 'Mentoring',
    items: [
      { label: '멘토 목록', to: '/mentoring/mentors' },
      { label: '예약 내역', to: '/mentoring/register' },
    ],
  },
  studylog: {
    title: 'Study Log',
    items: [
      { label: '학습 일지 목록', to: '/study' },
      { label: '학습 일지 작성', to: '/study/write' },
      { label: '공유 학습 일지', to: '/study/public' },
    ],
  },
  challenge: {
    title: 'Challenge',
    items: [
      { label: '일일 챌린지', to: '/challenge/daily' },
      { label: '챌린지 랭킹', to: '/challenge/ranking' },
      { label: '종합 챌린지', to: '/challenge/review' },
      { label: '챌린지 히스토리', to: '/mypage/challenge-history' },
    ],
  },
  mypage: {
    title: 'MyPage',
    items: [
      { label: '프로필 변경', to: '/mypage' },
      { label: '뱃지목록', to: '/mypage/badges' },
      { label: '멘토링 히스토리', to: '/mypage/mentoring-history' },
      { label: '통계', to: '/mypage/statistics' },
      { label: '챌린지 히스토리', to: '/mypage/challenge-history' },
    ],
  },
  alarm: {
    title: 'Alarm',
    items: [{ label: '알림 내역', to: '/mentee-alarm' }],
  },
  shop: {
    title: 'Shop',
    items: [
      { label: '상점', to: '/shop' },
      { label: '인벤토리', to: '/inventory' },
    ],
  },
};

const Sidebar = ({ menuType }) => {
  const location = useLocation();
  const hideSidebarPaths = ['/login', '/signup', '/starter'];

  // 🔍 디버깅용 로그
  // console.log('✅ [Sidebar] 현재 URL:', location.pathname);
  // console.log('✅ [Sidebar] 전달받은 menuType:', menuType);
  // console.log('✅ [Sidebar] menuMap[menuType]:', menuMap[menuType]);

  if (hideSidebarPaths.some((path) => location.pathname.startsWith(path))) {
    console.log('⛔ [Sidebar] 숨김 경로에 해당하여 사이드바를 렌더링하지 않습니다.');
    return null;
  }

  const menu = menuMap[menuType];

  if (!menu) {
    console.warn('❌ [Sidebar] menuType에 해당하는 메뉴가 없습니다:', menuType);
    console.log('[Sidebar] 호출된 위치:', new Error().stack);

    return <div style={{ color: 'red', padding: '1rem' }}>❌ Sidebar 메뉴 없음: {menuType}</div>;
  }

  const role = localStorage.getItem('role');
  const items = menu.items.map((item) => {
    if (menuType === 'mentoring' && item.label === '예약 내역' && role === 'MENTOR') {
      return { ...item, to: '/mentoring/mentor/register' };
    }
    return item;
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-title">{menu.title}</div>
      <nav className="sidebar-nav">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

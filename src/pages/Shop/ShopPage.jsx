import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Todo from '../../components/common/Todo';
import StickerCard from '../../components/shop/StickerCard';

import { getUserPoint, getAllStickers, purchaseSticker } from '../../api/shop';

const ShopPage = () => {
  const [myPoint, setMyPoint] = useState(0);
  const [stickers, setStickers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const rawMemberId = localStorage.getItem('memberId');
  const memberId = Number(rawMemberId);

  const fetchData = async () => {
    if (!memberId || isNaN(memberId)) {
      console.warn(' 유효하지 않은 memberId입니다. sessionStorage 값을 확인하세요:', rawMemberId);
      alert(' 로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const [pointRes, stickerRes] = await Promise.all([
        getUserPoint(memberId),
        getAllStickers(memberId),
      ]);
      setMyPoint(pointRes);

      const enriched = stickerRes.map((s) => ({
        ...s,
        image: s.imageUrl, // public 경로에서 바로 사용
      }));
      setStickers(enriched);

      setIsLoaded(true);
    } catch (err) {
      console.error('❌ 데이터 불러오기 실패:', err);
      alert('⚠️ 상점 데이터를 불러오지 못했습니다.');
    }
  };

  const handlePurchase = async (sticker) => {
    if (myPoint < sticker.cost) {
      alert('💸 포인트가 부족해요!');
      return;
    }
    if (sticker.purchased) {
      alert('이미 구매한 스티커입니다.');
      return;
    }

    try {
      await purchaseSticker(memberId, sticker.id);
      alert(`🎉 '${sticker.name}' 스티커를 구매했어요!`);
      fetchData();
    } catch (err) {
      console.error('❌ 스티커 구매 실패:', err);
      alert('⚠️ 구매에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [memberId]);

  const jabSimSeries = stickers.filter((s) => s.id >= 1 && s.id <= 4);
  const basicSeries = stickers.filter((s) => s.id >= 11 && s.id <= 15);

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar menuType="shop" />

        <main className="main" style={{ flex: 1 }} data-aos="fade-up">
          <div className="container py-5">
            <h1 className="h3 fw-bold mb-3" style={{ color: '#84cc16' }}>
              🎁 스티커 상점
            </h1>
            <p className="text-muted mb-4">나만의 학습 캘린더를 꾸며보세요!</p>
            <div className="mb-5 p-2 px-3 rounded bg-light border fw-bold w-fit">
              🪙 내 포인트: {myPoint}P
            </div>

            {isLoaded ? (
              <>
                <h4 className="fw-bold mb-3">🐰 짭심이 시리즈</h4>
                <div className="row mb-5">
                  {jabSimSeries.map((sticker) => (
                    <div key={sticker.id} className="col-6 col-md-3 mb-4">
                      <StickerCard
                        sticker={sticker}
                        onPurchase={handlePurchase}
                        purchased={sticker.purchased}
                        disabled={myPoint < sticker.cost}
                      />
                    </div>
                  ))}
                </div>

                <h4 className="fw-bold mb-3">⭐ 기본 스티커</h4>
                <div className="row">
                  {basicSeries.map((sticker) => (
                    <div key={sticker.id} className="col-6 col-md-3 mb-4">
                      <StickerCard
                        sticker={sticker}
                        onPurchase={handlePurchase}
                        purchased={sticker.purchased}
                        disabled={myPoint < sticker.cost}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-muted">⏳ 데이터를 불러오는 중입니다...</div>
            )}
          </div>
        </main>

        <div style={{ width: '300px', borderLeft: '1px solid #eee' }}>
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

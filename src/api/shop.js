import axios from 'axios';


const baseURL = 'https://api.siathub.com/v1';


// 1. 전체 스티커 목록 (구매 여부 포함)
export const getAllStickers = async (memberId) => {
  const response = await axios.get(`${baseURL}/shop/stickers`, {
    params: { memberId },
    withCredentials: true,
  });
  
  console.log('✅ getAllStickers 응답:', response.data);
  return response.data; // 배열만 반환
};

// 2. 사용자 포인트 조회
export const getUserPoint = async (memberId) => {
  const response = await axios.get(`${baseURL}/shop/point`, {
    params: { memberId },
    withCredentials: true,
  });
  console.log('✅ getUserPoint 응답:', response.data);
  return response.data; // 숫자만 반환
};

// 3. 스티커 구매
export const purchaseSticker = (memberId, stickerId) =>
  axios.post(
    `${baseURL}/shop/purchase`,
    {
      memberId,
      stickerId,
    },
    {
      withCredentials: true,
    }
  );

// 4. 인벤토리 조회
export const getInventory = async (memberId) => {
  const response = await axios.get(`${baseURL}/shop/inventory`, {
    params: { memberId },
    withCredentials: true,
  });
  return response.data;
};

// 5. 가방 슬롯 목록 조회
export const getBagItems = async (memberId) => {
  const response = await axios.get(`${baseURL}/shop/bag`, {
    params: { memberId },
    withCredentials: true,
  });
  return response.data;
};

// 6. 가방에 추가
export const addToBag = (memberId, stickerId, slotIndex) =>
  axios.post(
    `${baseURL}/shop/bag/add`,
    {
      memberId,
      stickerId,
      slotIndex,
    },
    {
      withCredentials: true,
    }
  );

// 7. 가방에서 제거
export const removeFromBag = (memberId, slotIndex) =>
  axios.delete(`${baseURL}/shop/bag/${slotIndex}`, {
    params: { memberId },
    withCredentials: true,
  });

// 8. 가방 전체 저장
export const saveBagItemsToServer = (memberId, bagItems) =>
  axios.post(
    `${baseURL}/shop/bag`,
    {
      memberId,
      bagItems, // 배열: [{ id, name, image }, ...]
    },
    {
      withCredentials: true,
    }
  );

import axios from './axios';

/** 멘토 알림 조회 */
export const getNotificationsMentor = (memberId) => {
  return axios.get(`/notifications/mentor/${memberId}`);
};

/** 멘티 알림 조회 */
export const getNotificationsMentee = (memberId) => {
  return axios.get(`/notifications/mentee/${memberId}`);
};

/** 알림 삭제 */
export const deleteNotification = (notificationId) => {
  return axios.delete(`/notifications/${notificationId}`);
};

// 요청 예시
// GET /api/notifications?memberId=3

// DELETE /api/notifications/21
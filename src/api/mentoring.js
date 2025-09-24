import axios from './axios';

/** 멘토 목록 조회 */
export const getMentors = (keyword, field) => {
  return axios.get('mentoring/mentors', {
    params: { keyword, field },
  });
};

/** 멘토 상세 조회 */
export const getMentorDetail = (mentorId) => {
  return axios.get(`/mentors/${mentorId}`);
};

/** 멘토링 신청 (멘티) */
export const applyMentoring = ({ mentorId, memberId, menteeName, date, introduction, subject, mentorMemberId }) => {
  return axios.post('/reservations', {
    mentorId,          // Long
    menteeId: memberId,          // Long
    menteeName,          // String
    date,              // ISO 형식 문자열
    introduction,      // String
    subject,           // String (comma로 연결된 주제 목록)
    mentorMemberId, 
  });
};

/** 멘티 - 본인 예약 목록 조회 */
export const getMentoringReservations = (memberId) => {
  return axios.get(`/reservations/mentee/${memberId}`);
};

/** 멘토 - 본인 예약 목록 조회 */
export const getMentorReservations = (mentorId) => {
  return axios.get(`/reservations/mentor/${mentorId}`);
};

/** 멘토 - 예약 수락 */
export const acceptMentoring = (reservationId) => {
  return axios.put(`/reservations/mentor/${reservationId}/accept`);
};

/** 멘토 - 예약 거절 */
export const rejectMentoring = (reservationId, rejectReason) => {
  return axios.put(`/reservations/mentor/${reservationId}/reject`, {
    rejectReason, // MentoringReservationRejectRequestDto
  });
};

/** 멘티 - 예약 취소 */
export const cancelMentoring = ({ reservationId, memberName, cancelReason }) => {
  return axios.put(`/reservations/mentee/${reservationId}/cancel`, {
    memberName,
    cancelReason,
  });
};

/** 멘토 - 예약 취소 */
export const cancelMentoringMentor = ({ reservationId, memberName, cancelReason }) => {
  return axios.put(`/reservations/mentor/${reservationId}/cancel`, {
    memberName,
    cancelReason,
  });
};

/** 멘토링 완료 히스토리 (멘티 기준) */
export const getMentoringHistory = (memberId) => {
  return axios.get(`/mentoring/mentee/${memberId}/completed`);
};

// /** 멘토 - 멘토링 완료 처리 */
// export const completeMentoring = (reservationId, content = '') => {
//   return axios.post(`/mentoring/mentor/${reservationId}/complete`, {
//     content, // MentoringCompleteRequestDto 에서 요구하는 필드
//   });
// };

export const completeMentoring = ({ reservationId, mentorMemberId, menteeId }) => {
  return axios.post(`/mentoring/mentor/${reservationId}/complete`, {
    mentorMemberId,
    menteeId,
    createdAt: new Date().toISOString().split('T')[0],
  });
};

/** 멘티 - 예약 닫기 */
export const hideMentoringReservation = (reservationId) => {
  return axios.patch(`/reservations/mentee/${reservationId}/hide`);
};

// 멘토 예약 닫기
export const hideMentoringReservationByMentor = (reservationId) => {
  return axios.patch(`/reservations/mentor/${reservationId}/hide`);
};
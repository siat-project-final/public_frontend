import axios from './axios';

/** 일정 목록 조회 */
// export const getSchedules = (memberId, startDate, endDate) => {
//   return axios.get(`/calendar/schedule/${memberId}`, {
//     params: { startDate, endDate },
//   });
// };

/** 일정 목록 조회 */
export const getSchedules = (memberId, startDate, endDate) => {
  return axios.get(`/calendar/schedule/list/${memberId}`, {
    params: { startDate, endDate },
  });
};

/** 일정 상세 조회 */
export const getScheduleById = (scheduleId) => {
  return axios.get(`/calendar/schedule/detail/${scheduleId}`);
};

/** 일정 추가 */
export const addSchedule = (scheduleData) => {
  return axios.post('/calendar/schedule', scheduleData);
};

/** 일정 수정 */
export const updateSchedule = (scheduleId, updatedData) => {
  return axios.put(`/calendar/schedule/${scheduleId}`, updatedData);
};

/** 일정 삭제 */
export const deleteSchedule = (scheduleId) => {
  return axios.delete(`/calendar/schedule/${scheduleId}`);
};


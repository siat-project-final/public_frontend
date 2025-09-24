import axios from './axios';

/** 투두리스트 전체 조회 */
export const getTodos = (memberId, date, isChecked) => {
  return axios.get(`/todos/${memberId}`, {
    params: { date, isChecked },
  });
};

/** 투두리스트 추가 */
export const addTodo = (memberId, contents, date) => {
  return axios.post(`/todos/${memberId}`, { contents, date });
};

/** 투두리스트 수정 */
export const updateTodo = (memberId, todoId, contents, date) => {
  return axios.put(`/todos/${memberId}/${todoId}`, {
    contents,
    date,
  });
};

/** 투두리스트 삭제 */
export const deleteTodo = (memberId, todoId) => {
  return axios.delete(`/todos/${memberId}/${todoId}`);
};


// 요청 예시
// 조회: GET /api/todos/1?date=2025-06-01&isChecked=false

// 추가: POST /api/todos/1 { contents: "리액트 정리", date: "2025-06-19" }

// 수정: PATCH /api/todos/1/44 { contents: "정리 완료", date: "2025-06-19" }

// 삭제: DELETE /api/todos/1/44
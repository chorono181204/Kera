import axios from 'axios'
import { API_URL } from '../utils/constants.js'
import authorizeAxiosInstance from '../utils/authorizeAxios.js';

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await authorizeAxiosInstance.get(`${API_URL}boards/${boardId}`)
  return response.data?.result
}
//api for delete board
export const deleteBoardAPI = async (boardId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}boards/${boardId}`)
  return response.data?.result
}
export const moveColumnInBoardAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.patch(`${API_URL}columns`, updateData)
  return response.data?.result
}
export const moveCardInColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.patch(`${API_URL}cards`, updateData)
  return response.data?.result
}
export const moveCardInBoardAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}cards`, updateData)
  return response.data?.result
}
export const createColumnAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}columns`, data)
  return response.data?.result
}
//Api for update column
export const updateColumnAPI = async (columnId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}columns/${columnId}`, data)
  return response.data?.result
}
//Api for delete column
export const deleteColumnAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}columns/${columnId}`)
  return response.data?.result
}
export const createCardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}cards`, data)
  return response.data?.result
}
export const refreshTokenAPI = async (data) => {
  const res = await authorizeAxiosInstance.post(`${API_URL}auth/refresh`, data)
  return res.data?.result
}
export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}auth/register`, data)
  return response.data?.result
}
export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizeAxiosInstance.get(`${API_URL}boards/my-boards${searchPath}`)
  return response.data.result
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}boards`, data)
  return response.data?.result
}
export const updateCardDetailAPI = async (cardId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}cards/${cardId}`, data)
  return response.data?.result
}
//api for delete card
export const deleteCardAPI = async (cardId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}cards/${cardId}`)
  return response.data?.result
}
// API for create new card comment
export const createCardCommentAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}comments`, data)
  return response.data?.result
}
//API for delete card comment
export const deleteCardCommentAPI = async (commentId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}comments/${commentId}`)
  return response.data?.result
}
//API for update card comment
export const updateCardCommentAPI = async (commentId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}comments/${commentId}`, data)
  return response.data?.result
}
//API for upload file
export const uploadFileAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}upload`, data)
  return response.data?.result
}
//API for get labels
export const getLabelsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_URL}labels`)
  return response.data?.result
}
//API for create label
export const createLabelAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}labels`, data)
  return response.data?.result
}
//API for delete label
export const deleteLabelAPI = async (labelId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}labels/${labelId}`)
  return response.data?.result
}
//API for update label
export const updateLabelAPI = async (labelId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}labels/${labelId}`, data)
  return response.data?.result
}
//API for create check list
export const createCheckListAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}cards/checklists`, data)
  return response.data?.result
}
//API for update check list
export const updateCheckListAPI = async (checkListId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}cards/checklists/${checkListId}`, data)
  return response.data?.result
}
//API for delete check list
export const deleteCheckListAPI = async (checkListId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}cards/checklists/${checkListId}`)
  return response.data?.result
}
//api for add user to card
export const addUserToCardAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}cards/users`, data)
  return response.data?.result
}
//api for remove user from card
export const removeUserFromCardAPI = async (cardId, cardUserId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}cards/${cardId}/users/${cardUserId}`)
  return response.data?.result
}
// api for get notification by user id
// Removed getNotificationByUserIdAPI as it's now handled by Redux
//api for get all users
export const getAllUsersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_URL}users`)
  return response.data?.result
}
// api for invite user to board
export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}boards/invite`, data)
  return response.data?.result
}
export const updateBoardAPI = async (boardId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}boards/${boardId}`, data)
  return response.data?.result
}



//searh user
export const searchUserAPI = async (keyword) => {
  const response = await authorizeAxiosInstance.get(`${API_URL}users/search/${keyword}`)
  return response.data?.result
}
export const verifyAccountAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}auth/verify-account`, data)
  return response.data?.result
}

export const toggleBoardStarredAPI = async (id, userId) => {
  const response = await authorizeAxiosInstance.put(
    `${API_URL}boards/starred/${id}`,
    userId,
    { headers: { 'Content-Type': 'text/plain' } }
  );
  return response.data?.result;
}

export const toggleBoardArchivedAPI = async (id, userId) => {
  const response = await authorizeAxiosInstance.put(
    `${API_URL}boards/archived/${id}`,
    userId,
    { headers: { 'Content-Type': 'text/plain' } }
  );
  return response.data?.result;
}

//api for remove user from board
export const removeUserFromBoardAPI = async (boardId, userId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}boards/${boardId}/users/${userId}`)
  return response.data?.result
}

//api for request join board
export const requestJoinBoardAPI = async (boardId,userId) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}boards/${boardId}/users/${userId}`)
  return response.data?.result
}

// Accept join request (set role to MEMBER)
export const acceptBoardRequestAPI = async (boardId, userId) => {
  const response = await authorizeAxiosInstance.put(
    `${API_URL}boards/${boardId}/users/${userId}`,
    'MEMBER',
    { headers: { 'Content-Type': 'text/plain' } }
  );
  return response.data?.result;
}
// Reject join request (set role to REJECTED)
export const rejectBoardRequestAPI = async (boardId, userId) => {
  const response = await authorizeAxiosInstance.put(
    `${API_URL}boards/${boardId}/users/${userId}`,
    'REJECTED',
    { headers: { 'Content-Type': 'text/plain' } }
  );
  return response.data?.result;
}

//api update user
export const updateUserAPI = async (data, userId) => {
  const response = await authorizeAxiosInstance.put(`${API_URL}users/${userId}`, data)
  return response.data?.result
}
//api for delete user
export const deleteUserAPI = async (userId) => {
  const response = await authorizeAxiosInstance.delete(`${API_URL}users/${userId}`)
  return response.data?.result
}

//api for create user
export const createUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_URL}users`, data)
  return response.data?.result
}
//api for get users
export const getUsersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_URL}users`)
  return response.data?.result
}
//api for get user by id
export const getUserByIdAPI = async (userId) => {
  const response = await authorizeAxiosInstance.get(`${API_URL}users/${userId}`)
  return response.data?.result
}

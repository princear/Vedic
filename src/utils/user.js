import {getDataFromAsyncStorage} from './asyncStorage';
import {callGetApi} from './axios';

export const getToken = async () => {
  const token = await getDataFromAsyncStorage('token');
  return token;
};

export const getPhoneNumber = async () => {
  return await getDataFromAsyncStorage('phone_number');
};

export const getActiveEmail = async () => {
  const email = await getDataFromAsyncStorage('active_email');
  return email;
};

export const getMasterEmail = async () => {
  const email = await getDataFromAsyncStorage('master_email');
  console.log(email,"masterEMAIL")
  return email;

};

export const getUserInfo = async email => {
  const url = `/v1/api/get-user-info?email=${email}`;
  const res = await callGetApi(url);
  return res;
};


export const getScoreByUser = async email => {
  const url = `/v1/api/get-score-by-user?user_email=${email}`;
  const res = await callGetApi(url);
  return res;
};



export const getVirtualProfiles = async () => {
  const master_email = await getMasterEmail();
  const url = `/v1/api/get-all-users-for-master-user?master_user_id=${master_email}`;
  const res = callGetApi(url);
  return res;
};
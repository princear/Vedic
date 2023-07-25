import axios from 'axios';
import {BASE_URL, TOKEN} from '@env';
import {getDataFromAsyncStorage} from './asyncStorage';

axios.defaults.baseURL = BASE_URL;

export function getUser() {}

export function callGetApi(url) {
  return new Promise(async (resolve, reject) => {
    try {
      // const token = await getDataFromAsyncStorage('token');
      const response = await axios.get(
        url,
        //   token && {
        //     headers: {Authorization: 'Bearer ' + TOKEN},
        //   },
        {
          headers: {Authorization: 'Bearer ' + TOKEN},
        },
      );
      return resolve(response);
    } catch (err) {
      return reject(err);
    }
  });
}

export function callPostApi(url, params) {
  return new Promise(async (resolve, reject) => {
    // const token = await getDataFromAsyncStorage('token');
    try {
      const response = await axios.post(
        url,
        params,
        //   access_token && {
        //     headers: {Authorization: 'Bearer ' + access_token},
        //   },
        {
          headers: {Authorization: 'Bearer ' + TOKEN},
        },
      );
      return resolve(response);
    } catch (err) {
      return reject(err);
    }
  });
}

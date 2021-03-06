
import config from 'config';
import fetch from '../utils/fetch';
import cache from '../utils/cache';

const appName = config.get('appName');
const SERVICE = config.get('services.github');
const API_URL = SERVICE.url;
const TIMEOUTS = SERVICE.timeouts;
const BASE_GITHUB_URL = `${API_URL}/api/github`;
const BASE_SCIENTIFIC_URL = `${API_URL}/api/scientific`;

/* =========================== basic funcs =========================== */

const fetchApi = (url, options = {}) => {
  const {
    body,
    qs = {},
    headers = {},
    method = 'get',
    timeouts = TIMEOUTS,
    baseUrl = BASE_GITHUB_URL
  } = options;
  headers['X-App-Name'] = appName;
  return fetch[method]({
    qs,
    body,
    headers,
    source: 'github',
    url: `${baseUrl}${url}`,
  }, timeouts);
};

const TTL = 60; // 1 min
const getFromCache = cache.wrapFn(
  fetchApi, 'hacknical-github', { ttl: TTL }
);

/* =========================== api funcs =========================== */

const getZen = token => getFromCache('/zen', {
  qs: { token }
});
const getOctocat = () => getFromCache('/octocat');

const getVerify = () => fetchApi('/verify');
const getToken = code => fetchApi('/token', {
  qs: { code }
});

const getLogin = token => fetchApi('/login', {
  qs: { token }
});
const getUser = (login, token) =>
  getFromCache(`/${login}`, {
    qs: { token }
  });

const getUserRepositories = (login, token) =>
  getFromCache(`/${login}/repositories`, {
    qs: { token }
  });
const getUserContributed = (login, token) =>
  getFromCache(`/${login}/contributed`, {
    qs: { token }
  });
const getUserCommits = (login, token) =>
  getFromCache(`/${login}/commits`, {
    qs: { token }
  });
const getUserLanguages = (login, token) =>
  getFromCache(`/${login}/languages`, {
    qs: { token }
  });
const getUserOrganizations = (login, token) =>
  getFromCache(`/${login}/organizations`, {
    qs: { token }
  });

const getUpdateStatus = login =>
  fetchApi(`/${login}/update/status`);

const updateUserData = (login, token) =>
  fetchApi(`/${login}/update`, {
    method: 'put',
    body: { token },
    timeouts: [null]
  });

const updateUser = (login, data) =>
  fetchApi(`/${login}`, {
    method: 'patch',
    body: { data },
    timeouts: [null]
  });

const getHotmap = (login, locale) =>
  getFromCache(`/${login}/hotmap`, {
    qs: { locale }
  });

const getUserStatistic = (login, token) =>
  getFromCache(`/${login}/statistic`, {
    qs: { token },
    baseUrl: BASE_SCIENTIFIC_URL,
  });

const getUserPredictions = (login, token) =>
  getFromCache(`/${login}/predictions`, {
    qs: { token },
    baseUrl: BASE_SCIENTIFIC_URL,
  });

const removePrediction = (login, fullName) =>
  fetchApi(`/${login}/predictions`, {
    baseUrl: BASE_SCIENTIFIC_URL,
    method: 'delete',
    body: {
      fullName,
    }
  });

const putPredictionsFeedback = (login, fullName, liked) =>
  fetchApi(`/${login}/predictions`, {
    baseUrl: BASE_SCIENTIFIC_URL,
    method: 'put',
    body: {
      liked,
      fullName,
    }
  });

export default {
  /* ===== */
  getZen,
  getOctocat,
  /* ===== */
  getToken,
  getLogin,
  getVerify,
  /* ===== */
  getUser,
  updateUser,
  getUserCommits,
  getUserLanguages,
  getUserContributed,
  getUserRepositories,
  getUserOrganizations,
  /* ===== */
  updateUserData,
  getUpdateStatus,
  /* ===== */
  getHotmap,
  /* ===== */
  removePrediction,
  getUserStatistic,
  getUserPredictions,
  putPredictionsFeedback,
};

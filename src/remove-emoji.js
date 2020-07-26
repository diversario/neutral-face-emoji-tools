import _ from 'lodash';
import axios from 'axios';
import { ConcurrencyManager } from 'axios-concurrency';
import log from './log'
import getSlackApiData from './get-slack-api-data';

const MAX_CONCURRENT_REQUESTS = 5;

const slackApi = axios.create({
  baseURL: `${window.location.origin}/api`
});

ConcurrencyManager(slackApi, MAX_CONCURRENT_REQUESTS);

const NO_OP = function () { };

function printError(error) {
  return error.toJSON ? error.toJSON().message : error.message
}

export default function removeEmoji(name, callback = NO_OP, attemptCount = 0) {
    const { apiToken, versionUid } = getSlackApiData();
    const timestamp = Date.now() / 1000;
    const version = versionUid ? versionUid.substring(0, 8) : 'noversion';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('token', apiToken);

    slackApi({
      method: 'post',
      url: `/emoji.remove`,
      params: {
        '_x_id': `${version}-${timestamp}`
      },
      data: formData,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      if (response && response.data.ok) {
        log.info(`[${name}] 🔥✅ deleted`)
        callback()
      } else {
        log.error(`[${name}] ${response}`)
        throw new Error('Something happened!')
      }
    }).catch((error) => {
      log.error(`[${name}] 🔥💣 delete failed on attempt ${attemptCount}`, printError(error))

      if (error.response) {
        if (attemptCount < 3) {
          if (error.response.status == 429) {
            let delay = error.response.headers['retry-after']

            log.error(`[${name}] 🔥💤 throttling delete for ${delay} seconds`)

            return setTimeout(() => {
              removeEmoji(name, callback, ++attemptCount)
            }, delay * 1000)
          } else {
            log.error(`[${name}] 🔥🤷‍♀️Unknown status code ${error.response.status}`)
          }
        } else {
          log.error(`[${name}] 🔥⚰️ out of attempts to delete`)
        }
      } else {
        log.error(`[${name}] 🔥❓something else happened on attempt ${attemptCount}`, printError(error))
      }

      callback(error);
    })
}

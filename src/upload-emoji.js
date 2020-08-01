import _ from 'lodash';
import axios from 'axios';
import { ConcurrencyManager } from 'axios-concurrency';
import uuid from 'uuid';
import log from './log'
import getSlackApiData from './get-slack-api-data';
import removeEmoji from './remove-emoji'

const MAX_CONCURRENT_REQUESTS = 5;

const slackApi = axios.create({
  baseURL: `${window.location.origin}/api`
});

ConcurrencyManager(slackApi, MAX_CONCURRENT_REQUESTS);

const NO_OP = function () {};

function printError(error) {
  return error.toJSON ? error.toJSON().message : error.message
}

export default function uploadEmoji (file, opts) {
  const id = uuid.v4();

  let upload = (callback = NO_OP, attemptCount = 0) => {
    const { apiToken, versionUid } = getSlackApiData();
    const timestamp = Date.now() / 1000;
    const version = versionUid ? versionUid.substring(0, 8) : 'noversion';
    const chunks = file.name.split('.')
    chunks.pop()
    const filename = chunks.join('.')
    const name = `${opts.prefix}${filename}${opts.suffix}`;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('mode', 'data');
    formData.append('token', apiToken);
    formData.append('image', file);

    slackApi({
      method: 'post',
      url: `/emoji.add`,
      params: {
        '_x_id': `${version}-${timestamp}`
      },
      data: formData,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      const error = _.get(response, 'data.error');

      if (error) {
        log.error(`[${name}] ⬆️😢 error uploading:`, printError(error))

        switch (error) {
          case 'error_name_taken':
            log.error(`[${name}] ⬆️✋ emoji already exists and overwrite is${opts.allowOverwrite ? '' : ' not'} allowed`)

            if (!opts.allowOverwrite) {
              throw new Error('Emoji already exists')
            }

            return removeEmoji(name, err => {
              if (err) {
                if (err.code == 'no_permission') {
                  throw new Error(`You're not allowed to overwrite this emoji`)
                }

                throw new Error("Couldn't remove emoji")
              }

              upload(callback, ++attemptCount)
            })
          case 'error_name_taken_i18n':
            log.error(`[${name}] ⬆️⛔️ conflicts with standard emoji name`)
            throw new Error("Cannot overwrite this emoji")
          default:
            throw error
        }
      }

      log.info(`[${name}] ⬆️✅ uploaded`)

      callback(id, error, response);
    }).catch((error) => {
      log.error(`[${name}] ⬆️😨 upload failed on attempt ${attemptCount}`, printError(error))

      if (error.response) {
        if (error.code == 'no_permission') {
          return callback(id, 'Not allowed to overwrite this emoji', null)
        }

        if (attemptCount < 3) {
          if (error.response.status == 429) {
            let delay = error.response.headers['retry-after']

            log.error(`[${name}] ⬆️💤 throttling upload for ${delay} seconds`)

            return setTimeout(() => {
              upload(callback, ++attemptCount)
            }, delay * 1000)
          } else {
            log.error(`[${name}] ⬆️🤷‍♀️Unknown status code ${error.response.status}`)
          }
        } else {
          log.error(`[${name}] ⬆️⚰️ out of attempts to upload`)
        }
      } else {
        log.error(`[${name}] ⬆️❌giving up upload on attempt ${attemptCount}`, printError(error))
      }

      callback(id, error, null);
    })
  }

  return {
    id,
    upload,
  }
}

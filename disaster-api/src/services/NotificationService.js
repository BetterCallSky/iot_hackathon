import Joi from 'joi';
import _ from 'lodash';
import decorate from 'decorate-it';

import request from 'superagent';

// ------------------------------------
// Exports
// ------------------------------------

const NotificationService = {
  refresh,
  sendNotification,
};

decorate(NotificationService, 'AppService');

export default NotificationService;

const services = JSON.parse(process.env.VCAP_SERVICES);
const { credentials } = services['user-provided'][0];

let accessToken = '';

async function refresh() {
  const ret = await request
    .post('https://iam.bluemix.net/identity/token')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      apikey: credentials.apikey,
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
    });
  accessToken = JSON.parse(ret.text).access_token;
}

refresh.params = [];
refresh.schema = {};

async function sendNotification(text, params, userId) {
  await request
    .post(`${credentials.url}/messages`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      message: {
        alert: text,
      },
      notificationType: 1,
      target: {
        userIds: [userId],
      },
      settings: {
        apns: {
          payload: params,
        },
      },
    });
}

sendNotification.params = ['text', 'params', 'userId'];
sendNotification.schema = {
  text: Joi.string().required(),
  params: Joi.object().required(),
  userId: Joi.string().required(),
};

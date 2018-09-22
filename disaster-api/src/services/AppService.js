import Joi from 'joi';
import _ from 'lodash';
import decorate from 'decorate-it';
import { Device, User } from '../models';

const ERROR_DISTANCE = 200;
const WARNING_DISTANCE = ERROR_DISTANCE * 3;
const INFO_DISTANCE = ERROR_DISTANCE * 10;

// ------------------------------------
// Exports
// ------------------------------------

const AppService = {
  test,
  event,
};

decorate(AppService, 'AppService');

export default AppService;

async function test() {
  return 123;
}

test.params = [];
test.schema = {};

function _isAlertValue(value) {
  // mock values for alerts
  return value > 50;
}

async function event(data) {
  const existing = await Device.findById(data.deviceId);
  if (!existing) {
    await Device.create({
      _id: data.deviceId,
      ..._.pick(data, 'value', 'type'),
      location: {
        type: 'Point',
        coordinates: [data.location.longitude, data.location.latitude],
      },
    });
    return;
  }
  const isAlreadyAlert = _isAlertValue(existing.value);
  const isAlert = _isAlertValue(data.value);
  existing.value = data.value;
  await existing.save();
  if (isAlert === isAlreadyAlert) {
    return;
  }
  if (isAlert) {
    console.log('START ALERT');
  } else {
    console.log('STOP ALERT');
  }
}

event.params = ['data'];
event.schema = {
  data: Joi.object()
    .keys({
      deviceId: Joi.number().required(),
      value: Joi.number().required(),
      type: Joi.string().required(),
      location: Joi.object()
        .keys({
          longitude: Joi.number().required(),
          latitude: Joi.number().required(),
        })
        .required(),
    })
    .required(),
};

function addUser(data) {}

addUser.params = ['data'];
addUser.schema = {
  data: Joi.object()
    .keys({
      deviceId: Joi.number().required(),
      value: Joi.number().required(),
      type: Joi.string().required(),
      location: Joi.object()
        .keys({
          longitude: Joi.number().required(),
          latitude: Joi.number().required(),
        })
        .required(),
    })
    .required(),
};

// /**
//  * Create password hash with pbkdf2
//  * @param {String} password the user password
//  * @param {String} salt the salt
//  * @returns {String} the password hash
//  * @private
//  */
// async function _createPasswordHash(password, salt) {
//   const hash = await crypto.pbkdf2(password,
//     salt, config.SECURITY.ITERATIONS,
//     config.SECURITY.PASSWORD_LENGTH,
//     'sha1');
//   return hash.toString('hex');
// }

// /**
//  * Login with email and password
//  * @param {String} email
//  * @param {String} password
//  * @returns {User} the user instance
//  */
// async function login(email, password) {
//   const errorMsg = 'Invalid email or password';
//   const user = await User.findOne({ email_lowered: email.toLowerCase() });
//   if (!user) {
//     throw new HTTPError.Unauthorized(errorMsg);
//   }
//   const hash = await _createPasswordHash(password, user.salt);
//   if (hash !== user.password) {
//     throw new HTTPError.Unauthorized(errorMsg);
//   }
//   return user;
// }

// login.params = ['email', 'password'];
// login.schema = {
//   email: Joi.string().required(),
//   password: Joi.string().required(),
// };

// /**
//  * Register a new user
//  * @param {Object} values the values to create
//  * @returns {User} the created user
//  */
// async function register(values) {
//   const existing = await User.findOne({ email_lowered: values.email.toLowerCase() });
//   if (existing) {
//     throw new HTTPError.BadRequest('Email address is already registered');
//   }
//   let salt = await crypto.randomBytes(config.SECURITY.SALT_LENGTH);
//   salt = salt.toString('hex');
//   values.salt = salt.toString('hex');
//   values.password = await _createPasswordHash(values.password, salt);
//   values.email_lowered = values.email.toLowerCase();

//   return await User.create(values);
// }

// register.params = ['values'];
// register.schema = {
//   values: Joi.object().keys({
//     password: Joi.string().required(),
//     email: Joi.string().email().required(),
//   }).required(),
// };

// /**
//  * Create bearer token
//  * @param {Number} userId the target user
//  * @returns {BearerToken} the token
//  */
// async function createBearerToken(userId) {
//   const token = uuid();
//   await BearerToken.create({ userId, _id: token });
//   return token;
// }

// createBearerToken.params = ['userId'];
// createBearerToken.schema = {
//   userId: Joi.objectId().required(),
// };

// /**
//  * Delete bearer token
//  * @param {String} token the access token
//  */
// async function deleteBearerToken(token) {
//   const bearerToken = await BearerToken.findById(token);
//   await bearerToken.destroy();
// }

// deleteBearerToken.schema = {
//   token: Joi.string().required(),
// };

// /**
//  * Log in with social network
//  * @param {String} accessToken the access token
//  * @param {String} provider the social provider name
//  * @returns {User} the logged in user
//  */
// async function socialLogin(accessToken, provider) {
//   const res = await request
//     .get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json')
//     .query({
//       access_token: accessToken,
//     })
//     .endAsync();
//   const body = res.body;
//   const profile = {
//     id: body.id,
//     email: body.email,
//     firstName: body.given_name,
//     lastName: body.family_name,
//     photoUrl: body.picture,
//   };

//   // user already connected
//   let user = await User.findOne({
//     [`${provider}Id`]: profile.id,
//   });
//   if (user) {
//     return user;
//   }

//   // match by email address
//   user = await User.findOne({ email_lowered: profile.email.toLowerCase() });
//   if (user) {
//     user[`${provider}Id`] = profile.id;
//     await user.save();
//     return user;
//   }

//   const salt = await crypto.randomBytes(config.SECURITY.SALT_LENGTH);
//   const values = {
//     salt: salt.toString('hex'),
//     password: await _createPasswordHash(uuid(), salt),
//     email: profile.email,
//     email_lowered: profile.email.toLowerCase(),
//     [`${provider}Id`]: profile.id,
//   };
//   return await User.create(values);
// }

// socialLogin.params = ['accessToken', 'provider'];
// socialLogin.schema = {
//   accessToken: Joi.string().required(),
//   provider: Joi.socialType().required(),
// };

import Joi from 'joi';
import _ from 'lodash';
import decorate from 'decorate-it';
import { Device, User, EnteredArea } from '../models';
import NotificationService from './NotificationService';

const ERROR_DISTANCE = 200;
const WARNING_DISTANCE = ERROR_DISTANCE * 3;
const INFO_DISTANCE = ERROR_DISTANCE * 10;

// ------------------------------------
// Exports
// ------------------------------------

const AppService = {
  test,
  event,
  registerUser,
  search,
  updatePosition,
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
  const location = {
    type: 'Point',
    coordinates: [data.location.longitude, data.location.latitude],
  };
  if (!existing) {
    await Device.create({
      _id: data.deviceId,
      ..._.pick(data, 'value', 'type'),
      isAlert: _isAlertValue(data.value),
      location,
    });
    return;
  }
  const isAlreadyAlert = _isAlertValue(existing.value);
  const isAlert = _isAlertValue(data.value);
  existing.value = data.value;
  existing.isAlert = isAlert;
  existing.location = location;
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

async function registerUser() {
  const user = new User();
  await user.save();
  return {
    userId: user.id,
  };
}

registerUser.params = [];
registerUser.schema = {};

async function _searchByDistance(criteria, maxDistance) {
  return await Device.find({
    isAlert: true,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [criteria.longitude, criteria.latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  });
}

async function search(criteria) {
  return await _searchByDistance(criteria, INFO_DISTANCE);
}

search.params = ['criteria'];
search.schema = {
  criteria: Joi.object()
    .keys({
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
    })
    .required(),
};

async function updatePosition(data) {
  const { userId } = data;
  const user = await User.findByIdOrError(userId);
  user.location = {
    type: 'Point',
    coordinates: [data.longitude, data.latitude],
  };
  const criteria = {
    longitude: data.longitude,
    latitude: data.latitude,
  };
  const allAreas = await EnteredArea.find({ userId });
  const allAreasIndex = _.keyBy(allAreas, 'deviceId');

  const errorItems = await _searchByDistance(criteria, ERROR_DISTANCE);
  const warningItems = await _searchByDistance(criteria, WARNING_DISTANCE);
  const sentErrors = {};
  let enteredCiritial = false;
  let enteredWarning = false;

  for (const device of errorItems) {
    if (allAreasIndex[device.deviceId]) {
      delete allAreasIndex[device.deviceId];
    } else {
      await EnteredArea.create({
        deviceId: device._id,
        userId,
      });
      await NotificationService.sendNotification(
        `⛔️ You are entering a critical zone.`,
        { device },
        userId
      );
      sentErrors[device._id] = true;
    }
  }
  for (const device of warningItems) {
    if (allAreasIndex[device.deviceId]) {
      delete allAreasIndex[device.deviceId];
    } else if (!sentErrors[device._id]) {
      await EnteredArea.create({
        deviceId: device._id,
        userId,
      });
      await NotificationService.sendNotification(
        `⚠️ You are entering a warning zone.`,
        { device },
        userId
      );
    }
  }
  for (const item of _.values(allAreasIndex)) {
    await item.delete();
  }
}

updatePosition.params = ['data'];
updatePosition.schema = {
  data: Joi.object()
    .keys({
      userId: Joi.string().required(),
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
    })
    .required(),
};

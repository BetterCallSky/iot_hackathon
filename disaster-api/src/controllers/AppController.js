import AppService from '../services/AppService';

export default {
  test,
  event,
  registerUser,
  search,
  updatePosition,
};

async function test(req, res) {
  res.json(await AppService.test());
}

async function event(req, res) {
  await AppService.event(req.body);
  res.json({
    ok: true,
  });
}
async function updatePosition(req, res) {
  await AppService.updatePosition(req.body);
  res.json({
    ok: true,
  });
}

async function registerUser(req, res) {
  res.json(await AppService.registerUser());
}

async function search(req, res) {
  res.json(
    await AppService.search({
      longitude: Number(req.query.longitude),
      latitude: Number(req.query.latitude),
    })
  );
}

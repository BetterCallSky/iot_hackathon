import AppService from '../services/AppService';

export default {
  test,
  event,
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

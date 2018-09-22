import AppController from './controllers/AppController';

export default {
  '/test': {
    get: {
      method: AppController.test,
      public: true,
    },
  },
  '/event': {
    post: {
      method: AppController.event,
      public: true,
    },
  },
};

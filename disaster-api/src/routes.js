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
  '/register': {
    post: {
      method: AppController.registerUser,
      public: true,
    },
  },
  '/position': {
    post: {
      method: AppController.updatePosition,
      public: true,
    },
  },
  '/search': {
    get: {
      method: AppController.search,
      public: true,
    },
  },
};

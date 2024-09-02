import { AppController } from '../controllers';

const router = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

module.exports = router;

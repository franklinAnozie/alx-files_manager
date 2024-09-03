import AppController from '../controllers/AppController';
import UserController from '../controllers/UserController';

const routes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UserController.postNew);
};

export default routes;

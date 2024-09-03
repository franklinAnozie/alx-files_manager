import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const routes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);
  app.get('/users/me', UsersController.getMe);
  app.post('/users', UsersController.postNew);
};

export default routes;

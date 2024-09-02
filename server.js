import e from 'express';
import routes from './routes';

const app = e();
const PORT = process.env.PORT || 5000;

routes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

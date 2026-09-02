import { createApp } from './app.js';

const port = process.env.PORT ?? 3002;
const app = createApp();

app.listen(port, () => {
  console.log(`notes-api listening on port ${port}`);
});

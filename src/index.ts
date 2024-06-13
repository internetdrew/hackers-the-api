import * as dotenv from 'dotenv';

export const processEnv: { [key: string]: any } = {};
// for (const key in process.env) {
//   processEnv[key] = process.env[key];
// }
dotenv.config({ processEnv });

import app from './server';

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

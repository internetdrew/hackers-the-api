import * as dotenv from 'dotenv';

export const processEnv: { [key: string]: any } = {};
dotenv.config({ processEnv });

import app from './server';

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

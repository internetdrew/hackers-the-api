import * as dotenv from 'dotenv';
import config from 'config';

export const processEnv: { [key: string]: any } = {};
dotenv.config({ processEnv });

import app from './server';

const port = config.get<number>('port');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

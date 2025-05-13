import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3010', 10),
  auth: {
    url: process.env.AUTH_API_URL ?? 'http://localhost:3001',
  },
  core: {
    url: process.env.CORE_API_URL ?? 'http://localhost:3002',
  },
  belvo: {
    url: process.env.BELVO_API_URL ?? 'http://localhost:3003',
  },
}));

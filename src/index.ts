import app from '@app';
import { logger } from '@utils/logger';
import { PORT } from '@config';

(global as any).logger = logger;

app.listen(<number>(<unknown>PORT));

import { HTTPMethod } from '../../Types.ts';
import handler from './handler.ts';

const eventsHandler = {
  path: '/events',
  method: HTTPMethod.GET,
  handler,
}

export default eventsHandler;
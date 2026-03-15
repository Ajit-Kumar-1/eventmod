import { HTTPMethod } from '../../Types.ts';
import handler from './handler.ts';

const acknowledgeHandler = {
  path: '/acknowledge',
  method: HTTPMethod.PUT,
  handler,
}

export default acknowledgeHandler;
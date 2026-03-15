import { HTTPMethod } from '../../Types.ts';
import handler from './handler.ts';

const claimHandler = {
  path: '/claim',
  method: HTTPMethod.PUT,
  handler,
}

export default claimHandler;
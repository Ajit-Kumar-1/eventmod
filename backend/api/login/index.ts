import { HTTPMethod } from '../../Types.ts';
import handler from './handler.ts';

const loginHandler = {
  path: '/login',
  method: HTTPMethod.POST,
  handler,
}

export default loginHandler;
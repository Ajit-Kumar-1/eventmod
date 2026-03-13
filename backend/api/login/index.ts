import handler from './handler.ts';

const loginHandler = {
  path: '/login',
  method: 'post',
  handler,
}

export default loginHandler;
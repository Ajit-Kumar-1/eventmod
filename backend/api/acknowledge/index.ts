import handler from './handler.ts';

const acknowledgeHandler = {
  path: '/acknowledge',
  method: 'put',
  handler,
}

export default acknowledgeHandler;
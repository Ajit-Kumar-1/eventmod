import handler from './handler.ts';

const claimHandler = {
  path: '/claim',
  method: 'put',
  handler,
}

export default claimHandler;
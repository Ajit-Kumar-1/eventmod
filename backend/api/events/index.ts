import handler from './handler.ts';

const eventsHandler = {
  path: '/events',
  method: 'get',
  handler,
}

export default eventsHandler;
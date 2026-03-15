import handler from './handler.ts';

const assignmentsHandler = {
  path: '/assignments',
  method: 'get',
  handler,
}

export default assignmentsHandler;
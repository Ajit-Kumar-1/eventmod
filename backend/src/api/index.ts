import loginRoute from './login/index.ts';
import eventsRoute from './events/index.ts';
import claimRoute from './claim/index.ts';
import acknowledgeRoute from './acknowledge/index.ts';
import type { Route } from '../Types.ts';

const Routes: Route[] = [
  loginRoute,
  eventsRoute,
  claimRoute,
  acknowledgeRoute,
];

export default Routes;
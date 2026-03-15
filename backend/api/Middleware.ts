export function serverError(res: any, message?: string) {
  return res.status(500).json({ error: message ?? 'Failed to load data' });
}

export function clientError(res: any, message?: string) {
  return res.status(400).json({ error: message ?? 'Bad request' });
}

export function successResponse(res: any, message?: string) {
  return res.status(200).json({ message: message ?? 'Success' });
}

export function unauthorizedResponse(res: any, message?: string) {
  return res.status(401).json({ message: message ?? 'Unauthorized' });
}
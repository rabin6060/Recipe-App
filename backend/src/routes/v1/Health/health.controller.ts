import { Request, Response } from 'express';

import { errorResponse, successResponse } from '../../../utils/HttpResponse';

const HealthController = {
  healthCheck(request: Request, response: Response) {
    try {
      const healthCheckValue = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      };

      successResponse({ message: 'OK', response, data: healthCheckValue });
    } catch (e) {
      const healthCheckValue = {
        uptime: process.uptime(),
        message: e,
        timestamp: Date.now(),
      };
      errorResponse({ message: 'Failed', response, data: healthCheckValue, status: 503 });
    }
  },
};

export default HealthController;

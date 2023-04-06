import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateEventIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const eventId = req.params.eventId;
    if (eventId === '') return;
    if (eventId.match(/^[0-9a-fA-F]{24}$/) == null) {
      res.status(400).send('Invalid eventId parameter');
      return;
    }
    next();
  }
}

import {Route} from '../base-route';
import {NextFunction} from 'express';

export class WaitingRoute extends Route {

  url(): string {
    return '/client/waiting';
  }

  activate(req, res, next: NextFunction): void {
    this.view('client/waiting');
  }
}
import {Route} from '../base-route';
import {NextFunction} from 'express';

export class HostingRoute extends Route {

  url(): string {
    return '/client/hosting';
  }

  activate(req, res, next: NextFunction): void {
    this.view('client/hosting');
  }
}
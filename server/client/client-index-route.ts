import {Route} from '../base-route';
import {NextFunction} from 'express';

export class ClientIndexRoute extends Route {

  url(): string {
    return '/client';
  }

  activate(req, res, next: NextFunction): void {
    this.view('client/index');
  }
}
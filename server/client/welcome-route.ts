import {Route} from '../base-route';
import {NextFunction} from 'express';

export class WelcomeRoute extends Route {

  url(): string {
    return '/client/welcome';
  }

  activate(req, res, next: NextFunction): void {
    this.view('client/welcome');
  }
}
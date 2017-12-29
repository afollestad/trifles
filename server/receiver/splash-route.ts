import {Route} from '../base-route';
import {NextFunction} from 'express';

export class SplashRoute extends Route {

  url(): string {
    return '/receiver/splash';
  }

  activate(req, res, next: NextFunction): void {
    this.view('receiver/splash');
  }
}
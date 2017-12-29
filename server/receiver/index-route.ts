import {Route} from '../base-route';
import {NextFunction} from 'express';

export class IndexRoute extends Route {

  url(): string {
    return '/receiver';
  }

  activate(req, res, next: NextFunction): void {
    this.view('receiver/index');
  }
}
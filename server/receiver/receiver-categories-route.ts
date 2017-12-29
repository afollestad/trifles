import {Route} from '../base-route';
import {NextFunction} from 'express';

export class ReceiverCategoriesRoute extends Route {

  url(): string {
    return '/receiver/categories';
  }

  activate(req, res, next: NextFunction): void {
    this.view('receiver/categories');
  }
}
import {Route} from '../base-route';
import {NextFunction} from 'express';

export class ClientCategoryRoute extends Route {

  url(): string {
    return '/client/selectcategory';
  }

  activate(req, res, next: NextFunction): void {
    this.view('client/selectcategory');
  }
}
import {Route} from '../base-route';
import {NextFunction} from 'express';

export class ClientGameOverRoute extends Route {

  url(): string {
    return '/client/gameover';
  }

  activate(req, res, next: NextFunction): void {
    this.view('client/gameover');
  }
}
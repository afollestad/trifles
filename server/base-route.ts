import {NextFunction, Response, Router} from 'express';

export abstract class Route {

  res: Response;

  public attach(router: Router) {
    router.get(this.url(), (req, res, next: NextFunction) => {
      this.res = res as Response;
      this.activate(req, res, next);
    });
  }

  abstract url(): string;

  abstract activate(req, res, next: NextFunction): void;

  public view(view: string, options?: object): void {
    this.res.render(view, options);
  }

  public json(data?: any): void {
    this.res.contentType('application/json');
    this.res.send(data);
  }
}

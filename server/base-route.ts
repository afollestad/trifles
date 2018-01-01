import {NextFunction, Response, Router} from 'express';
import {detect} from 'detect-browser';

export abstract class Route {

  res: Response;

  public attach(router: Router) {
    router.get(this.url(), (req, res, next: NextFunction) => {
      const browser = detect();
      if (browser && browser.name !== 'chrome' && browser.name !== 'crios' && browser.name !== 'node') {
        console.log(`Browser ${browser.name} is unsupported.`);
        res.render('error',
          {
            error: '<b>Trifles</b> only can support <a href="https://www.google.com/chrome/">Google Chrome</a> due to restrictions in other browsers.'
          });
        return;
      }
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

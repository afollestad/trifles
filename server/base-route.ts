import {NextFunction, Response, Router} from 'express';

export abstract class Route {

  res: Response;

  /**
   * @param {string} ua
   */
  static isSupportedUa(ua) {
    const result = ua.indexOf('Chrome') !== -1 || ua.indexOf('CriOS') !== -1;
    console.log(`${ua} supported? ${result}`);
    return result;
  }

  public attach(router: Router) {
    router.get(this.url(), (req, res, next: NextFunction) => {
      let userAgent = req.headers['user-agent'][0];
      if (Route.isSupportedUa(userAgent)) {
        res.render('error',
          {
            error: '<b>Trifles</b> only can support <a href="https://www.google.com/chrome/">Google Chrome</a> due to restrictions in other browsers.<br/><br/><span style="font-size: 0.8rem">${userAgent}</span>'
          });
        return;
      }
      console.log(`${userAgent} UA is supported.`);
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

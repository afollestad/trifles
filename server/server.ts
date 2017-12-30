'use strict';

import * as express from 'express';
import {NextFunction} from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import {ReceiverIndexRoute} from './receiver/receiver-index-route';
import {SplashRoute} from './receiver/splash-route';
import * as nodeSassMiddleware from 'node-sass-middleware';
import {ReceiverGameOverRoute} from './receiver/receiver-game-over-route';
import {ClientIndexRoute} from './client/client-index-route';
import {WelcomeRoute} from './client/welcome-route';
import {WaitingRoute} from './client/waiting-route';
import {HostingRoute} from './client/hosting-route';
import {ReceiverTriviaRoute} from './receiver/receiver-trivia-route';
import {ClientTriviaRoute} from './client/trivia-route';
import {ClientCategoryRoute} from './client/client-category-route';
import {ReceiverCategoriesRoute} from './receiver/receiver-categories-route';
import {ClientGameOverRoute} from './client/client-gameover-route';

// noinspection JSUnusedGlobalSymbols
export class Server {

  public app: express.Application;

  // noinspection JSUnusedGlobalSymbols
  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    this.app = express();
    this.preConfig();
    this.routes();
    this.postConfig();
  }

  public preConfig(): void {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(favicon(path.join(__dirname, 'public', 'images', 'logo.png')));

    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'pug');

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));

    this.app.use(cookieParser());
    this.app.use(nodeSassMiddleware({
      src: path.join(__dirname, 'public'),
      dest: path.join(__dirname, 'public'),
      indentedSyntax: true, // true = .sass and false = .scss
      sourceMap: true
    }));
  }

  public routes(): void {
    const router = express.Router();
    router.get('/', function (req, res) {
      res.redirect('/client');
    });

    // Client
    new ClientIndexRoute().attach(router);
    new WelcomeRoute().attach(router);
    new WaitingRoute().attach(router);
    new HostingRoute().attach(router);
    new ClientCategoryRoute().attach(router);
    new ClientTriviaRoute().attach(router);
    new ClientGameOverRoute().attach(router);

    // Receiver
    new ReceiverIndexRoute().attach(router);
    new SplashRoute().attach(router);
    new ReceiverCategoriesRoute().attach(router);
    new ReceiverTriviaRoute().attach(router);
    new ReceiverGameOverRoute().attach(router);

    this.app.use(router);
  }

  public postConfig(): void {
    // noinspection JSUnusedLocalSymbols
    this.app.use(function (req, res, next: NextFunction) {
      res.sendStatus(404);
    });

    // noinspection JSUnusedLocalSymbols
    this.app.use(function (err, req, res, next: NextFunction) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(500);
      res.render('error');
    });
  }
}
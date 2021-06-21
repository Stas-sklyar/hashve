"use strict";
exports.__esModule = true;
require("zone.js/dist/zone-node");
require("reflect-metadata");
// for debug
require('source-map-support').install();
// for tests
var test = process.env['TEST'] === 'true';
// ssr DOM
var domino = require('domino');
var fs = require('fs');
var path = require('path');
// index from browser build!
var template = fs.readFileSync(path.join(__dirname, '.', 'dist/hashve-front', 'index.html')).toString();
// for mock global window by domino
var win = domino.createWindow(template);
// from server build
var files = fs.readdirSync(process.cwd() + "/dist/hashve-front-server");
// mock
global['window'] = win;
// not implemented property and functions
Object.defineProperty(win.document.body.style, 'transform', {
    value: function () {
        return {
            enumerable: true,
            configurable: true
        };
    }
});
// mock documnet
global['document'] = win.document;
// othres mock
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;
var core_1 = require("@angular/core");
var express = require("express");
var compression = require("compression");
var cookieparser = require("cookie-parser");
// lazy loader
var provideModuleMap = require('@nguniversal/module-map-ngfactory-loader').provideModuleMap;
// get server main
var mainFiles = files.filter(function (file) { return file.startsWith('main'); });
// with hash
var hash = mainFiles[0].split('.')[1];
// main from server impl.
var _a = require("./dist/hashve-front-server/main." + hash), AppServerModuleNgFactory = _a.AppServerModuleNgFactory, LAZY_MODULE_MAP = _a.LAZY_MODULE_MAP;
var express_engine_1 = require("@nguniversal/express-engine");
var tokens_1 = require("@nguniversal/express-engine/tokens");
// port
var PORT = process.env.PORT || 4000;
// static path from prerenders
var static_paths_1 = require("./static.paths");
// for test
var process_1 = require("process");
core_1.enableProdMode();
var app = express();
// gzip
app.use(compression());
// cokies
app.use(cookieparser());
// redirects!
var redirectowww = false;
var redirectohttps = false;
var wwwredirecto = true;
app.use(function (req, res, next) {
    // for domain/index.html
    if (req.url === '/index.html') {
        res.redirect(301, 'https://' + req.hostname);
    }
    // check if it is a secure (https) request
    // if not redirect to the equivalent https url
    if (redirectohttps &&
        req.headers['x-forwarded-proto'] !== 'https' &&
        req.hostname !== 'localhost') {
        // special for robots.txt
        if (req.url === '/robots.txt') {
            next();
            return;
        }
        res.redirect(301, 'https://' + req.hostname + req.url);
    }
    // www or not
    if (redirectowww && !req.hostname.startsWith('www.')) {
        res.redirect(301, 'https://www.' + req.hostname + req.url);
    }
    // www or not
    if (wwwredirecto && req.hostname.startsWith('www.')) {
        var host = req.hostname.slice(4, req.hostname.length);
        res.redirect(301, 'https://' + host + req.url);
    }
    // for test
    if (test && req.url === '/test/exit') {
        res.send('exit');
        process_1.exit(0);
        return;
    }
    next();
});
// engine
app.engine('html', express_engine_1.ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
}));
// must
app.set('view engine', 'html');
app.set('views', 'src');
// all search
app.get('*.*', express.static(path.join(__dirname, '.', 'dist/hashve-front')));
// static
app.get(static_paths_1.ROUTES, express.static(path.join(__dirname, '.', 'static')));
// dynamic render
app.get('*', function (req, res) {
    // mock navigator from req.
    global['navigator'] = req['headers']['user-agent'];
    var http = req.headers['x-forwarded-proto'] === undefined ? 'http' : req.headers['x-forwarded-proto'];
    var url = req.originalUrl;
    // tslint:disable-next-line:no-console
    console.time("GET: " + url);
    res.render('../dist/hashve-front/index', {
        req: req,
        res: res,
        // provers from server
        providers: [
            // for http and cookies
            {
                provide: tokens_1.REQUEST,
                useValue: req
            },
            {
                provide: tokens_1.RESPONSE,
                useValue: res
            },
            // for absolute path
            {
                provide: 'ORIGIN_URL',
                useValue: http + "://" + req.headers.host
            },
        ]
    }, function (err, html) {
        if (!!err) {
            throw err;
        }
        // tslint:disable-next-line:no-console
        console.timeEnd("GET: " + url);
        res.send(html);
    });
});
app.listen(PORT, function () {
    console.log("listening on http://localhost:" + PORT + "!");
});

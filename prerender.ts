import 'zone.js/dist/zone-node';
import 'reflect-metadata';
const {AppServerModuleNgFactory} = require('./dist/hashve-front-server/main');
import {writeFileSync} from 'fs';
import {renderModuleFactory} from '@angular/platform-server';





renderModuleFactory(AppServerModuleNgFactory, {
  document: '<app-root></app-root>',
  url: '/'
})
  .then(html => {
    console.log('Pre-rendering successful, saving prerender.html');
    writeFileSync('./prerender.html', html);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });

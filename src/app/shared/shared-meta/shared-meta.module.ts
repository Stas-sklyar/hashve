import { NgModule } from '@angular/core';
import { MetaLoader, MetaModule, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export function metaFactory(translate: TranslateService): MetaLoader {
  return new MetaStaticLoader({
    callback: (key: string): Observable<string | Object> => translate.get(key),
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    // applicationName: 'App Universal',
    defaults: {
      title: 'Default page title',
      description: 'Default description',
      'og:site_name': 'App site Universal',
      'og:type': 'website',
      'og:locale:alternate': [
        { code: 'en', name: 'English', culture: 'en-US' },
        { code: 'heb', name: 'Hebrew', culture: 'he-IL' },
      ]
        .map((lang: any) => lang.culture)
        .toString(),
    },
  });
}

@NgModule({
  imports: [
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: metaFactory,
      deps: [TranslateService],
    }),
  ],
})
export class SharedMetaModule {}

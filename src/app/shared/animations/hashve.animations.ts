import {animate, group, query, stagger, state, style, transition, trigger} from '@angular/animations';

export const expandAnimation = [
  trigger('detailExpand', [
    state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
    state('expanded', style({height: 'auto'})),
    transition('expanded <=> collapsed', animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
];

export const showStoreBar = [
  trigger('storeBarSowed', [
    state('notShowed', style({top: '-200px'})),
    state('showed', style({top: '0px'})),
    transition('notShowed <=> showed', animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
];

export const showCallButton = [
  trigger('callButtonSowed', [
    state('notShowed', style({top: '-200px'})),
    state('showed', style({top: '80%'})),
    transition('notShowed <=> showed', animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
];

export const fadeInFadeOutAnimation = [
  trigger('slideInOut', [
    state('expanded', style({
      'max-height': '1000px', 'opacity': '1', 'visibility': 'visible'
    })),
    state('collapsed', style({
      'max-height': '0px', 'opacity': '0', 'visibility': 'hidden', 'overflow': 'hidden'
    })),
    transition('expanded => collapsed', [group([
        animate('400ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('600ms ease-in-out', style({
          'max-height': '0px'
        })),
        animate('700ms ease-in-out', style({
          'visibility': 'hidden'
        }))
      ]
    )]),
    transition('collapsed => expanded', [group([
        animate('1ms ease-in-out', style({
          'visibility': 'visible'
        })),
        animate('600ms ease-in-out', style({
          'max-height': '500px'
        })),
        animate('800ms ease-in-out', style({
          'opacity': '1'
        }))
      ]
    )])
  ]),
];

export const fadeInAnimation = [trigger('fadeIn', [
  transition(':enter', [
    style({opacity: '0', margin: '-20px'}),
    animate('.5s ease-out', style({opacity: '1', margin: '0px'})),
  ]),
  transition(':leave', [
    style({opacity: '1', margin: '0px'}),
    animate('.5s ease-out', style({opacity: '0', margin: '-20px'})),
  ]),
]),];

export const listAnimation = [trigger('listAnimation', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      stagger(100, [
        animate('0.5s', style({opacity: 0}))
      ])
    ], {optional: true}),
    query(':enter', [
      style({opacity: 0}),
      stagger(100, [
        animate('0.5s', style({opacity: 1}))
      ])
    ], {optional: true})
  ])
])];

export const rotateAnimation = [
  trigger('rotateAnimation', [
    state('up', style({transform: 'rotate(0deg)'})),
    state('down', style({transform: 'rotate(-180deg)'})),
    transition('up <=> down', animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
  ]),
];

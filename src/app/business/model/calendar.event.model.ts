import { startOfDay, endOfDay } from 'date-fns';

export class CalendarEvent
{
  start: Date;
  end?: Date;
  title: string;
  color: {
    primary: string;
    secondary: string;
  };
  // actions?: CalendarEventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: {
    location: string,
    notes: string
  };
  _id?: string;

  /**
   * Constructor
   *
   * @param data
   */
  constructor(data?)
  {
    if(data && data._id){
      this._id = data._id;
    }
    data = data || {};
    this.allDay = data.allDay || false;
    if(this.allDay){

    }
    this.start = this.allDay?startOfDay(new Date(data.start) || startOfDay(new Date())):new Date(data.start) || startOfDay(new Date());
    this.end = this.allDay?endOfDay(new Date(data.end) || endOfDay(new Date())):new Date(data.end) || endOfDay(new Date());
    this.title = data.title || '';
    this.color = {
      primary  : data.color && data.color.primary || '#1e90ff',
      secondary: data.color && data.color.secondary || '#D1E8FF'
    };
    this.draggable = data.draggable;
    this.resizable = {
      beforeStart: data.resizable && data.resizable.beforeStart || true,
      afterEnd   : data.resizable && data.resizable.afterEnd || true
    };
    //this.actions = data.actions || [];
    this.cssClass = data.cssClass || '';
    this.meta = {
      location: data.meta && data.meta.location || '',
      notes   : data.meta && data.meta.notes || ''
    };
  }
}

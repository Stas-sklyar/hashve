import {ApplicationState} from '../Enum/ApplicationState';

export class AppRouterState {
  state: ApplicationState;
  element: any;

  public constructor(state){
    this.state = state.state;
    this.element = state.element;
  }

  public isEmpty(): boolean {
    return this.state ? false : true;
  }

  public resetState(){
    this.state = undefined;
    this.element = undefined;
  }
}

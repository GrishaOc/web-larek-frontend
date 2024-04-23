import { IEvents } from './events';
export abstract class Model<T> {
  constructor(data: Partial<T>, protected evt: IEvents) {
    Object.assign(this, data);
  }

  emitChanges(event: string, payload?: object) {
    this.evt.emit(event, payload ?? {});
  }
}
import {Injectable} from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class DataService {

  resources: DayPilot.ResourceData[] = [
    {proveedor: 'Proveedor 1', id: 'P1'},
    {proveedor: 'Proveedor 2', id: 'P2'},
    {proveedor: 'Proveedor 3', id: 'P3'},
  ];

  events: DayPilot.EventData[] = [
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });
  }

  getResources(): Observable<any[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });
  }

}

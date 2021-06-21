import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class BaseService<T> {

  constructor(
    protected httpClient: HttpClient,
    protected url: string,
    protected endpoint: string) {
  }

  public create(item: T): Observable<T> {
    return this.httpClient.post<T>(`${this.url}${this.endpoint}`, item);
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put<T>(`${this.url}${this.endpoint}/${(item as any)._id}`, item);
  }

  public read(id: string): Observable<T> {
    return this.httpClient
      .get(`${this.url}${this.endpoint}/${id}`).pipe(map((data: any) => data as T));
  }

  public list(): Observable<T[]> {
    return this.httpClient.get(`${this.url}${this.endpoint}`).pipe(map((data: any) => {
      return data as T[];
    }));
  }

  public delete(id: string): Observable<any> {
    return this.httpClient.delete(`${this.url}${this.endpoint}/${id}`);
  }
}

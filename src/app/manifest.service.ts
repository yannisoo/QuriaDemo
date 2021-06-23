import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {

 

  constructor(private http: HttpClient) {
    
   } 

   getManifests(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-API-Key': '8e66dfa160d24a67aa33dfe141c95468',
      })
    }; 
    return this.http.get<any>('https://www.bungie.net/Platform/Destiny2/Manifest/'   , httpOptions).pipe(catchError(this.handleError));
  }
    catchThemAll(url: string): Observable<any>{
      return this.http.get<any>('https://www.bungie.net' +  url ).pipe(catchError(this.handleError));
    }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

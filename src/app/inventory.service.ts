import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {
  
 httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      'X-API-Key': '8e66dfa160d24a67aa33dfe141c95468',
    })
  };  
  
  constructor(private http: HttpClient) {
    
   }
   getMembershipDataById(): Observable<any>{

    return this.http.get<any>('https://www.bungie.net/Platform/User/GetMembershipsById/' + localStorage.getItem('membership_id') +'/2/'   , this.httpOptions).pipe(catchError(this.handleError));
  }
  getProfile(primarymember: any): Observable<any>{

    return this.http.get<any>('https://www.bungie.net/Platform/Destiny2/2/Profile/' + primarymember +'/?components=CharacterEquipment,ItemSockets'   , this.httpOptions).pipe(catchError(this.handleError));
  }
   getCharacterInventory(): Observable<any>{
    return this.http.get<any>('https://www.bungie.net/Platform/Destiny2/2/Profile/4611686018451545226/Character/2305843009262335627?components=CharacterEquipment,ItemSockets'   , this.httpOptions).pipe(catchError(this.handleError));
  }
   equipItem(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-API-Key': '8e66dfa160d24a67aa33dfe141c95468',
      })
    }; 
    
    return this.http.post<any>('https://www.bungie.net/Platform/Destiny2/Manifest/',  httpOptions).pipe(catchError(this.handleError));
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

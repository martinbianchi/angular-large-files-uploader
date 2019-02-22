import { Injectable, Inject } from '@angular/core';
import { BASE_URL } from './ng7-large-files-upload-lib.module';
import { Observable, Subject } from 'rxjs';
import { HttpRequest, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Ng7LargeFilesUploadLibService {

  BASE_URL;

  constructor(@Inject(BASE_URL) base:string, private _httpClient: HttpClient) {
    this.BASE_URL = base;
   }

   upload(files: Array<File>): { [key: string]: {progress: Observable<number> } } {
    debugger;
    const status: { [key: string]: {progress: Observable<number>}} = {};
    const url = this.BASE_URL;
    files.forEach(file => {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const req = new HttpRequest('POST',url,formData, {
        reportProgress: true
      });

      const progress = new Subject<number>();

      this._httpClient.request(req).subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          const percentDone = Math.round(100 * event.loaded / event.total);

          progress.next(percentDone);
        }
        else if (event instanceof HttpResponse){
          progress.complete();
        }
      });

      status[file.name] = {
        progress: progress.asObservable()
      }
    });

    return status;
  }
   
}

import { NgModule, InjectionToken } from '@angular/core';
import { Ng7LargeFilesUploadLibComponent } from './ng7-large-files-upload-lib.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

export const BASE_URL = new InjectionToken<string>('BASE_URL');

@NgModule({
  declarations: [Ng7LargeFilesUploadLibComponent],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [Ng7LargeFilesUploadLibComponent]
})

export class Ng7LargeFilesUploadLibModule { 
  static forRoot(host: string){
    return {
      ngModule: Ng7LargeFilesUploadLibModule,
      providers: [{
        provide: BASE_URL,
        useValue: host
      }]
    }
  }
}

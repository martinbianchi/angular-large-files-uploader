import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng7LargeFilesUploadLibComponent } from './ng7-large-files-upload-lib.component';
import { Ng7LargeFilesUploadLibService } from './ng7-large-files-upload-lib.service';
import { NO_ERRORS_SCHEMA, InjectionToken } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';

describe('Ng7LargeFilesUploadLibComponent', () => {
  let component: Ng7LargeFilesUploadLibComponent;
  let fixture: ComponentFixture<Ng7LargeFilesUploadLibComponent>;
  let mockService;

  let ARRAY: Array<any>;
  let OLDARRAY: Array<any>;
  let NEWARRAY: Array<any>;

  const BASE_URL = new InjectionToken<string>('BASE_URL');

  beforeEach(() => {

    ARRAY = [
      { id: 1, name: "file 1", url: "url 1", isInsert: false, isDelete: false },
      { id: 2, name: "file 2", url: "url 2", isInsert: false, isDelete: false },
      { id: 3, name: "file 3", url: "url 3", isInsert: false, isDelete: false },
      { id: 4, name: "file 4", url: "url 4", isInsert: false, isDelete: false }
    ];
    OLDARRAY = [
      { id: 1, name: "file 1", url: "url 1", isInsert: false, isDelete: false },
      { id: 2, name: "file 2", url: "url 2", isInsert: false, isDelete: false },
      { id: 3, name: "file 3", url: "url 3", isInsert: false, isDelete: false },
      { id: 4, name: "file 4", url: "url 4", isInsert: false, isDelete: false }
    ];
    NEWARRAY = [
      { id: null, name: "file 1", url: "url 1", isInsert: true, isDelete: false },
      { id: null, name: "file 2", url: "url 2", isInsert: true, isDelete: false },
      { id: null, name: "file 3", url: "url 3", isInsert: true, isDelete: false },
      { id: null, name: "file 4", url: "url 4", isInsert: true, isDelete: false }
    ];

    mockService = jasmine.createSpyObj(['upload']);
    TestBed.configureTestingModule({
      declarations: [Ng7LargeFilesUploadLibComponent],
      providers: [
        { provide: Ng7LargeFilesUploadLibService, useValue: mockService },
        { provide: BASE_URL, useValue: "SARASA"},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })

      fixture = TestBed.createComponent(Ng7LargeFilesUploadLibComponent);
      fixture.detectChanges();

      component = fixture.componentInstance;
      component._attachments = ARRAY;
      component._oldAttachments = OLDARRAY;
      component._newAttachments = NEWARRAY;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove file from array if call deleteFromArray', () => {
    const elem = ARRAY[0];

    fixture.componentInstance.deleteFromArray(elem, ARRAY);

    expect(ARRAY.length).toBe(3);
    expect(ARRAY.includes(elem)).toBeFalsy();
  })

  describe('DeleteFiles', () => {
    it('should delete file from oldattachments if call deleteFiles', () => {
      const elem = OLDARRAY[1];
      // fixture.componentInstance._attachments = ARRAY;
      // fixture.componentInstance._oldAttachments = OLDARRAY;

      fixture.componentInstance.deleteFiles(elem);

      expect(fixture.componentInstance._oldAttachments.length).toBe(3);
      expect(fixture.componentInstance._oldAttachments.includes(elem)).toBeFalsy();
    });

    it('should update property in allattachments if call deleteFiles', () => {
      // fixture.componentInstance._attachments = ARRAY;
      const elem = OLDARRAY[1];
      
      fixture.componentInstance.deleteFiles(elem);

      expect((ARRAY.find(x => x.id == elem.id)).isDelete).toBeTruthy();
      expect((ARRAY.find(x => x.id == elem.id)).isInsert).toBeFalsy();
    });
  });

  it('should call upload method in service when call onSaveChange with canSendData = true', () => {
    component.canSendData = true;
    const status: { [key: string]: {progress: Observable<number>}} = {};
    status['1'] = {
      progress: new Subject<number>().asObservable()
    }
    mockService.upload.and.returnValue(status)
    
    component.onSaveChanges();

    expect(mockService.upload).toHaveBeenCalledTimes(1);
  });

  it('should dont call upload method in service when call onSaveChange with canSendData = false', () => {
    component.canSendData = false;
    const status: { [key: string]: {progress: Observable<number>}} = {};
    status['1'] = {
      progress: new Subject<number>().asObservable()
    }
    mockService.upload.and.returnValue(status)

    component.onSaveChanges();

    expect(mockService.upload).toHaveBeenCalledTimes(0);
  });
});

import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Ng7LargeFilesUploadLibService } from './ng7-large-files-upload-lib.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'mb-large-files-uploader',
  templateUrl: './ng7-large-files.upload-lib.component.html',
  styleUrls: ['./ng7-large-files-upload-lib.component.css']
})
export class Ng7LargeFilesUploadLibComponent implements OnInit {

  constructor(
    private service: Ng7LargeFilesUploadLibService,
  ) {
  }

  ngOnInit() {
    //Clone initial attachments array
    this._oldAttachments = JSON.parse(JSON.stringify(this._attachments));
  }

  @ViewChild('file') file;

  /**
   * if true the component will be responsible to send data at the specified endpoint
   */
  @Input() canSendData: boolean = false;

  /**
   * Allows to download attachments
   */
  @Input() canDownload: Boolean = true;

  /**
   * Upload new attachments behavior
   */
  @Input() canUpload: Boolean = true;

  /**
   * Delete attachments uploaded behavior
   */
  @Input() canDelete: Boolean = true;

  /**
   * Label for formControl
   */
  @Input() title: String;

  /**
   * Text for save button if canSendData = true
   */
  @Input() saveButtonText: String = "Guardar"

  /**
   * Initial attachments
  */
  @Input() _attachments: Array<MyFile> = [];

  

  //Attachments added
  _newAttachments: Array<MyFile> = [];

  //Attachments wich already have
  _oldAttachments: Array<MyFile> = [];

  /**
   * Return the list of attachments in each change
   */
  @Output() updatedAttachmentsEmitter = new EventEmitter<any>();


  // public _newAttachments: Set<File> = new Set();

  addFiles() {
    this.file.nativeElement.click();
  }

  files = new Array<MyFile>();


  removeFiles(f: any, aArray) : void {
    this.deleteFromArray(f, aArray);
    this.removeFromAllAttachments(f);
  }

  deleteFiles(f: any) : void {
    let a = this._attachments.find(x => x.id == f.id); 
    a.isDelete = true;
    a.isInsert = false;
    this.deleteFromArray(a, this._oldAttachments);
  }

  deleteFromArray(f: any, aArray) {
    aArray.forEach( (item, index) => {
      if((item.fileName === f.name || item.name === f.name)) aArray.splice(index,1);
    });
    this.updatedAttachmentsEmitter.emit(this._attachments);
  }

  removeFromAllAttachments(f: any) : void {
    this._attachments.forEach( (item, index) => {
      if(item === f) this._attachments.splice(index,1);
    });
    this.updatedAttachmentsEmitter.emit(this._attachments);
  }


  onFilesAdded() : void {
    Array.prototype.forEach.call(this.file.nativeElement.files, (f: MyFile) => {
      let newAttach = this._newAttachments.find(x => x.name == f.name);
      let oldAttach = this._oldAttachments.find(x => x.name == f.name);
      let attach = this._attachments.find(x => x.name == f.name);
      let attachNew = this._attachments.find(x => x.name == f.name && x.id == undefined);
      if(newAttach) {
        this.deleteFromArray(newAttach, this._newAttachments);
        if(attachNew) {
          this.removeFromAllAttachments(attachNew);
        }
      }
      else if(oldAttach) {
        this.deleteFiles(attach);
        this.deleteFromArray(oldAttach, this._oldAttachments);
      }

      f.isInsert = true;
      f.isDelete = false;
      
      this.files.push(f);

      this._newAttachments.push(f);
      this._attachments.push(f);
      
      this.updatedAttachmentsEmitter.emit(this._attachments);
    });
  }

  onSaveChanges(){
    if(!this.canSendData) return;
    let uploadStatus = this.service.upload(this._attachments);
    
    let allProgressObservables = [];
    for(let key in uploadStatus){
      allProgressObservables.push(uploadStatus[key].progress);
    }

    if(allProgressObservables != undefined){
      forkJoin(allProgressObservables).subscribe(end => {
        console.log("all finished")
      })
    }
  }
}



export interface MyFile extends File{
  isInsert;
  isDelete;
  id;
  url;
}
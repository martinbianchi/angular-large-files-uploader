# Ng7LargeFilesUploadLib
Is a library for upload large files to a API Backend server.


## Installation

`ng7-large-files-upload-lib` is available as a NPM package. To install `ng7-large-files-upload-lib` in your project directory run:

    $ npm install --save ng7-large-files-upload-lib
Afterwards you can import `ng7-large-files-upload-lib` in your angular project by adding the `Ng7LargeFilesUploadLibModule` to your Module declaration as followed

    import { 
	    Ng7LargeFilesUploadLibModule,
	    Ng7LargeFilesUploadLibComponent
	 } from 'ng7-large-files-upload-lib';
    
     @NgModule({
	     imports:  [
		     ArchwizardModule,
		     //or if you want the component submit the data:
		     ArchwizardModule.forRoot('<url to your api endpoint>')
     ],
	    exports: [
			Ng7LargeFilesUploadLibComponent
		]    
	})
	export  class  Module  {  }

## How to use the uploader

To use this uploader component in an angular project simply add a `mb-large-files-uploader` component to the html template of your component

    <mb-large-files-uploader title="Label for uploader">
    </mb-large-files-uploader>

## Inputs
  
#### [canSendData]:
> if true the component will be responsible to send data at the specified endpoint. Default false.

#### [canDownload]:
> Allows to download attachments. Default true.

#### [canUpload]:
> Upload new attachments behavior. Default true.

#### [canDelete]:
> Delete attachments uploaded behavior. Default true.

#### [title]:
> Label for the uploader.

#### [saveButtonText]:
> Text for save button if canSendData = true.

#### [_attachments]:
> Initial attachments. The array must be of type `File` 

## Outputs
#### (updatedAttachmentsEmitter):
> Return the list of attachments in each change.

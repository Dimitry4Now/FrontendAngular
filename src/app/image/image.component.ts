import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadService } from '../upload.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent{

  selectedxlfiles?: FileList;
  result:any;
  currentfile?: File;
  fileandinstancekeyobj:any={};
  message = '';
  progress = 0;

  fileinfos?: Observable<any>;

  constructor(private http: HttpClient, private uploadservice:UploadService) { }

  selectedfiles(event: Event){
    console.log("detected event")
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if(fileList){
      console.log("fileList not empty")
      this.selectedxlfiles = fileList;
    }
    if(this.selectedxlfiles)
    for(let i=0;i<this.selectedxlfiles.length;i++){
      console.log(this.selectedxlfiles[i]);
      this.currentfile=this.selectedxlfiles[i];
      this.uploadservice.uploadtoserver(this.currentfile).subscribe((res:any)=>{
        console.log(res.body);
      }); 
    }
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedxlfiles) {
      const file: File | null = this.selectedxlfiles.item(0);

      if (file) {
        this.currentfile = file;

        this.uploadservice.uploadtoserver(this.currentfile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileinfos = this.uploadservice.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentfile = undefined;
          }
        });
      }

      this.selectedxlfiles = undefined;
    }
  }

  delete(filename: String):void{
    let res = this.uploadservice.deleteFile(filename);
    this.fileinfos = this.uploadservice.getFiles();
  }

  ngOnInit(): void {
    this.fileinfos = this.uploadservice.getFiles();
  }

}

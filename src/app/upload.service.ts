import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseUrl:string='http://localhost:9090/file';

  constructor(private http:HttpClient) { }

  uploadtoserver(selectedfile:File): Observable<HttpEvent<{}>>{
    let url:string=this.baseUrl+'/upload';
    let headers = new HttpHeaders().set('access-control-allow-origin',"http://localhost:9090/");
    console.log(url);
    const data: FormData=new FormData();
    data.append('file', selectedfile);
    const newrequest=new HttpRequest('POST',url,data,{
      headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(newrequest);
    //return this.http.post(url,selectedfiles);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  deleteFile(filename:String){
    let url:string=this.baseUrl+'/delete/'+filename;
    console.log(url);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "DELETE", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
  }
}
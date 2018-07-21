import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import { TypePage } from '../type/type';
import { RecorderPage } from '../recorder/recorder';
import { ProfilePage } from '../profile/profile';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

import { getBaseUrl } from '../../getBaseUrl';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { NgModuleCompileResult } from '@angular/compiler/src/ng_module_compiler';
import { TemplateBindingParseResult } from '@angular/compiler';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  clicked: boolean = false;
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject = new MediaObject(null);
  audioList: any[] = [];
  public voiceRecord: boolean;
  public textRecord: boolean;
  public lottieConfig: Object;
  public audioToStore: ArrayBuffer;
  public fileToUpload: ArrayBuffer;

  private animation: any;

  public FOLDER = 'sb-s3/';

  constructor(
    public navCtrl: NavController,
    private media: Media,
    private file: File,
    public platform: Platform,
    public alertCtrl: AlertController,  
    private transfer: FileTransfer, 
    public loadingCtrl: LoadingController,
    public getBaseUrl: getBaseUrl, 
    public http: Http) {

    this.voiceRecord = true;
    this.textRecord = false;

    this.lottieConfig = {
      path: "assets/animations/data.json",
      autoplay: true,
      loop: true
    };
  }

  handleAnimation(anim: any) {
    this.animation = anim;
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  uploadRecording() {

    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

    this.audio = this.media.create(this.filePath);

    this.http.post(this.getBaseUrl.getBaseUrl() + "/postVoiceRecordings", {
        voiceRecording: this.filePath
      })
        .subscribe(
          result => {
            loader.dismiss();
            console.log('recording posted');
            console.log(result);
          },
          error => {
            loader.dismiss();
            console.log(error);
          }
        );


    // this.file.readAsArrayBuffer(this.filePath, this.fileName).then(result => {
    //   console.log('hi!');
      // this.http.post(this.getBaseUrl.getBaseUrl() + "/postVoiceRecordings", {
      //   voiceRecording: result
      // })
      //   .subscribe(
      //     result => {
      //       loader.dismiss();
      //       console.log('recording posted');
      //       console.log(result);
      //     },
      //     error => {
      //       loader.dismiss();
      //       console.log(error);
      //     }
      //   );

    // })
    // .catch(err => {
    //   console.error('Convert error', err);
    //   loader.dismiss()
    // });
    // .catch(err => Log.e(String, String))
    }

  // uploadRecording() {
  //   let loader = this.loadingCtrl.create({
  //           content: "Uploading..."
  //         });
  //         loader.present();
  //   var fileToUpload = this.file.readAsArrayBuffer(this.filePath, this.fileName);
  // }

  // uploadRecording() {
  //     let loader = this.loadingCtrl.create({
  //       content: "Uploading..."
  //     });
  //     loader.present();
  //     const fileTransfer: FileTransferObject = this.transfer.create();
    
  //     let options: FileUploadOptions = {
  //       fileKey: 'ionicfile',
  //       fileName: 'ionicfile',
  //       chunkedMode: false,
  //       mimeType: "audio/3gp",
  //       headers: {}
  //     }
    
  //     fileTransfer.upload(this.filePath, this.getBaseUrl.getBaseUrl() + "/postVoiceRecordings", options)
  //       .then((data) => {
  //       console.log(data+" Uploaded Successfully");
  //       loader.dismiss();
  //       // this.presentToast("Image uploaded successfully");
  //     }, (err) => {
  //       console.log(err);
  //       loader.dismiss();
  //       // this.presentToast(err);
  //     });
  //   }
    
    // console.log('recording uploading...');

    // this.file.readAsArrayBuffer(this.filePath, this.fileName).then(body => {
    //   const bucket = new S3(
    //     {
    //       accessKeyId: 'AKIAIQFKJ3XG3KXBW5WA',
    //       secretAccessKey: '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',
    //       region: 'us-east-1'
    //     }
    //   );

    //   const params = {
    //     Bucket: 'songbird-bucket',
    //     Key: this.fileName,
    //     Body: body
    //   };

    //   bucket.upload(params, function (err, data) {
    //     if (err) {
    //       console.log('There was an error uploading your file: ', err);
    //       return false;
    //     }

    //     console.log('Successfully uploaded file.', data);
    //     return true;
    //   })
    // })
    // .catch(err => console.log(err))
    // }

  stopRecord() {
    this.audio.stopRecord();
    this.recording = false;
    // console.log(typeof this.audio);
    // let data = { filename: this.fileName };
    // // this.file.readAsArrayBuffer(this.filePath, this.fileName).then(body => {
    // //   this.audioToStore = body
    // // });

    // this.audioList.push(data);
    // localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    
  }

  playAudio(file, idx) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
      console.log(this.audio);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  switchRecord() {
    this.voiceRecord = !this.voiceRecord;
    this.textRecord = !this.textRecord;
  }

  record() {

    try {
      if (this.platform.is('ios')) {
        this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
        this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
        this.audio = this.media.create(this.fileName);
      } else if (this.platform.is('android')) {
        this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
        this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
        this.audio = this.media.create(this.filePath);
      }
      this.audio.startRecord();
      this.recording = true;
    }
    catch (e) {
      this.showAlert('Sorry, could not start recording. Contact us for support!')
    }
  }

  type() {
    this.navCtrl.push(TypePage)
  }

  navToHome() {
    this.navCtrl.popToRoot()
  }

  swipeEvent(e) {
    if (e.direction == '2') {
      this.navCtrl.parent.select(2);
    }
    else if (e.direction == '4') {
      this.navCtrl.parent.select(0);
    }
  }

}

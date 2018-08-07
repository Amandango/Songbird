import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import { TypePage } from '../type/type';
import { RecorderPage } from '../recorder/recorder';
import { ProfilePage } from '../profile/profile';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Base64 } from '@ionic-native/base64';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

import { getBaseUrl } from '../../getBaseUrl';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { NgModuleCompileResult } from '@angular/compiler/src/ng_module_compiler';
import { TemplateBindingParseResult } from '@angular/compiler';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

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
    public http: Http,
    private base64: Base64,
    public nativePageTransitions: NativePageTransitions,
    private mediaCapture: MediaCapture) {

    this.voiceRecord = false;
    this.textRecord = true;

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

  // captureImage() {
  //   let options: CaptureImageOptions = { limit: 3 };
  //   this.mediaCapture.captureImage(options)
  //     .then(
  //       (data: MediaFile[]) => console.log(data),
  //       (err: CaptureError) => console.error(err)
  //     );
  // }

  ionViewWillLeave() {

    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 300,
      slowdownfactor: 1,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 10,
      fixedPixelsTop: 70,
      fixedPixelsBottom: 60
    };

    this.nativePageTransitions.slide(options)
      .then(result => {
        console.log('success' + result);
      })
      .catch(err => {
        console.log(err);
      });
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

  stopRecord() {
    this.audio.stopRecord();
    this.audio = this.media.create(this.filePath);
    this.recording = false;

    //saving audio file to local storage

    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
  }

  //Trying to transfer file to API using file transfer

  // uploadRecording() {

  // const fileTransfer: FileTransferObject = this.transfer.create();

  // let options: FileUploadOptions = {
  //   fileKey: 'file',
  //   fileName: 'name.jpg',
  // };

  // fileTransfer.upload(this.filePath, this.getBaseUrl.getBaseUrl() + "/postVoiceRecordings")
  //   .then(data => {
  //     console.log('success!');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // }

  //Trying to convert to base64 file, then posting that 

  // uploadRecording() {

  //   this.audio = this.media.create(this.filePath);
  //   this.base64.encodeFile(this.filePath).then((base64File: string) => {
  //     console.log(base64File);
  //     this.http.post(this.getBaseUrl.getBaseUrl() + "/postVoiceRecordings", {
  //       voiceRecording: base64File
  //     })
  //       .subscribe(
  //         result => {
  //           loader.dismiss();
  //           console.log('recording posted');
  //           console.log(result);
  //         },
  //         error => {
  //           loader.dismiss();
  //           console.log(error);
  //         }
  //       );
  //   }, (err) => {
  //     console.log(err);
  //   });

  // }

  //Trying to convert to Array Buffer

  // uploadRecording() {

  //   this.file.readAsArrayBuffer(this.filePath, this.fileName).then(result => {
  //     console.log('hi!');
  //     this.http.post(this.getBaseUrl.getBaseUrl() + "/postVoiceRecordings", {
  //       voiceRecording: result
  //     })
  //       .subscribe(
  //         result => {
  //           loader.dismiss();
  //           console.log('recording posted');
  //           console.log(result);
  //         },
  //         error => {
  //           loader.dismiss();
  //           console.log(error);
  //         }
  //       );

  //   })
  //     .catch(err => {
  //       console.error('Convert error', err);
  //       loader.dismiss()
  //     });
  // }

  //Trying to create file transfer object and transfering file

  // uploadRecording() {

  //   let loader = this.loadingCtrl.create({
  //     content: "Uploading..."
  //   });
  //   loader.present();
  //   const fileTransfer: FileTransferObject = this.transfer.create();

  //   let options: FileUploadOptions = {
  //     fileKey: 'ionicfile',
  //     fileName: 'ionicfile',
  //     chunkedMode: false,
  //     mimeType: "audio/3gp",
  //     headers: {}
  //   }

  //   fileTransfer.upload(this.filePath, this.getBaseUrl.getBaseUrl() + "/postVoiceRecordings", options)
  //     .then((data) => {
  //       console.log(data + " Uploaded Successfully");
  //       loader.dismiss();
  //       // this.presentToast("Image uploaded successfully");
  //     }, (err) => {
  //       console.log(err);
  //       loader.dismiss();
  //       // this.presentToast(err);
  //     });
  // }

  //Play audio saved on local storage

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


}

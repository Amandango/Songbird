import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import { TypePage } from '../type/type';
import { RecorderPage } from '../recorder/recorder';
import { ProfilePage } from '../profile/profile';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

import { getBaseUrl } from '../../getBaseUrl';


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

  constructor(
    public navCtrl: NavController,
    private media: Media,
    private file: File,
    public platform: Platform,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public getBaseUrl: getBaseUrl,
    public http: Http,
    public nativePageTransitions: NativePageTransitions,
    private camera: Camera) {

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

  //Swipe between profile, record page, and home

  swipeEvent(e) {
    if (e.direction == '2') {
      this.navCtrl.parent.select(2);
    }
    else if (e.direction == '4') {
      this.navCtrl.parent.select(0);
    }
  }

  ionViewWillLeave() {

    //Adding smooth page transitions on native

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
  };

  //Take a photo

  takePhoto() {

    console.log('taking photo ran');

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  }

  //Record a voice recording

  record() {

    try {
      if (this.platform.is('ios')) {
        this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
        this.audio = this.media.create(this.fileName);
      } else if (this.platform.is('android')) {
        this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
        this.audio = this.media.create(this.fileName);
      }

      this.audio.startRecord();
      this.recording = true;
    }
    catch (e) {
      this.showAlert('Sorry, could not start recording. Contact us for support!')
    }
  }

  //End voice recording

  stopRecord() {
    this.audio.stopRecord();
    this.audio = this.media.create(this.filePath);
    this.recording = false;

    //saving audio file to local storage

    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
  }

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

  //Switches between voice recording and text input

  switchRecord() {
    this.voiceRecord = !this.voiceRecord;
    this.textRecord = !this.textRecord;
  }


}

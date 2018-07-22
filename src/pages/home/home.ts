import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import { TypePage } from '../type/type';
import { RecorderPage } from '../recorder/recorder';
import { ProfilePage } from '../profile/profile';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Base64 } from '@ionic-native/base64';


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
    public nativePageTransitions: NativePageTransitions) {

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
          .then( result => {
            console.log('success' + result);
          })
          .catch(err => {
            console.log(err);
          });
       
       }

    }

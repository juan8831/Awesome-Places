import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { normalizeURL } from 'ionic-angular';
import { PlacesProvider } from '../../providers/places/places';
import { File, FileError, Entry } from '@ionic-native/file';

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  location: Location = {
    lat: 40.7624,
    long: -73.97598
  }

  locationIsSet = false;

  imageURL = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private geoLocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private placesProvider: PlacesProvider,
    private file: File
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

  onSubmit(form: NgForm) {
    this.placesProvider.addPlace(
      form.value.title, form.value.description, this.location, this.imageURL
    );
    form.reset();
    this.location = {
      lat: 40.7624,
      long: -73.97598
    };
    this.imageURL = '';
    this.locationIsSet = false;
  }

  onOpenMap() {
    var modal = null;
    if (this.locationIsSet) {
      modal = this.modalCtrl.create(SetLocationPage, { location: this.location, marker: this.location });
    }
    else {
      modal = this.modalCtrl.create(SetLocationPage, { location: this.location });
    }

    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.location = data.location;
        this.locationIsSet = true;
      }
    });
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your locaton...'
    });

    loader.present();

    this.geoLocation.getCurrentPosition()
      .then(location => {
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.long = location.coords.longitude;
        this.locationIsSet = true;
      })
      .catch(error => {
        loader.dismiss();
        this.toastCtrl.create({
          message: 'Could not get location',
          duration: 2500
        }).present();
        console.log(error);
      });

  }

  OnTakePicture() {
    const options: CameraOptions = {
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }
    this.camera.getPicture(options)
      .then(imageData => {

        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';       
        this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
          .then(
            (data: Entry) => {
              this.imageURL = normalizeURL(data.nativeURL);
              this.camera.cleanup();
            }
          )
          .catch(
            (err: FileError) => {
              this.imageURL = '';
              const toast = this.toastCtrl.create({
                message: 'Could not save the image. Please try again',
                duration: 2500
              });
              toast.present();
              this.camera.cleanup();
            }
          );
        this.imageURL = normalizeURL(this.imageURL);
      })
      .catch(err => {
        this.imageURL = '';
              const toast = this.toastCtrl.create({
                message: 'Could not take the image. Please try again',
                duration: 2500
              });
              toast.present();
              this.camera.cleanup();
      });
  }

}

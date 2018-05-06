import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Place } from '../../models/place';
import { PlacesProvider } from '../../providers/places/places';

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  place: Place;
  index: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    private placesProvider: PlacesProvider

  ) 
  {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('index');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacePage');
  }

  onLeave(){
    this.viewCtrl.dismiss();
  }

  onDelete(){
    this.placesProvider.deletePlace(this.index);
    this.viewCtrl.dismiss();
  }

}

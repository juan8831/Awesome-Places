import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../models/place';
import { PlacesProvider } from '../../providers/places/places';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  places : Place[];

  addPlacePage = AddPlacePage;

  constructor(public navCtrl: NavController, 
    private placesProvider: PlacesProvider,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(){
    this.placesProvider.fetchPlaces()
    .then((places: Place[]) => {
      this.places = places;
    });
  }

  ionViewWillEnter(){
    this.places = this.placesProvider.loadPlaces();
  }


  onOpenPlace(place: Place, index: number){
    const modal = this.modalCtrl.create(PlacePage, {place: place, index: index});
    modal.present();

    modal.onDidDismiss(() => {
      this.places = this.placesProvider.loadPlaces();
    });
    
    //TODO: reload places after modal dismiss
  }

}

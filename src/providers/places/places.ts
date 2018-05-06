import { Injectable } from '@angular/core';
import { Place } from '../../models/place';
import { Location } from '../../models/location';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

declare var cordova: any;

@Injectable()
export class PlacesProvider {



  private places: Place[] = [];
  
  

  constructor(private storage: Storage, private file: File) {
    console.log('Hello PlacesProvider Provider');
  }

  addPlace(title: string, description: string, location: Location, imageURL: string){
    const place = new Place(title, description, location, imageURL);
    this.places.push(place);
    
    this.storage.set('places', this.places)
      .then(data => {

      })
      .catch( err =>{
        this.places.splice(this.places.indexOf(place), 1);
      });
  }

  loadPlaces() : Place[] {
    return this.places.slice();
  }

  deletePlace(index: number){
    const place = this.places[index];
    this.places.splice(index, 1);
    this.storage.set('places', this.places)
      .then(() => {
        this.removeFile(place);
      })
      .catch(err => {

      });
  }

  removeFile(place: Place){
    const currentName = place.imageURL.replace(/^.*[\\\/]/, '');
    this.file.removeFile(cordova.file.dataDirectory, currentName)
      .then(() => {
        console.log('Removed file');
      })
      .catch(err => {
        console.log('Error while removing file');
        this.addPlace(place.title, place.description, place.location, place.imageURL);
      });
  }

  fetchPlaces(){
    return this.storage.get('places')
    .then((places: Place[]) => {
      this.places = places != null ? places : [];
      return this.places.slice();
    })
    .catch(err =>{
      console.log(err);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IceAndFireService } from '../ice-and-fire.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public item = null;

  constructor(private _route: ActivatedRoute, private _location: Location, private _iceAndFireService: IceAndFireService) { }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._iceAndFireService.getItemById(id)
      .then(data => {
        this.item = data;
        // console.log(data);
        this._getDetails();
      })
      .catch(err => console.log(err));
  }

  private _getDetails() {
    if (this.item === null) {
      return;
    }
    if (this.item.type === 'characters') {
      // clear arrays if it contains blank data
      if (this.item.titles.length === 1 && !this.item.titles[0]) {
        this.item.titles = [];
      }
      if (this.item.tvSeries.length === 1 && !this.item.tvSeries[0]) {
        this.item.tvSeries = [];
        this.item.playedBy = [];
      }
      if (this.item.aliases.length === 1 && !this.item.aliases[0]) {
        this.item.aliases = [];
      }

      // create properties to show in details
      this.item.allegianceNames = [];
      this.item.bookNames = [];
      this.item.pronoun = this.item.gender === 'Male' ? 'He' : 'She';
      this.item.childPronoun = this.item.gender === 'Male' ? 'son' : 'daughter';
      this.item.fatherName = '';
      this.item.motherName = '';

      // fetch name(s) from url(s)
      this.item.allegiances.forEach(houseUrl => {
        this._iceAndFireService.getItemByUrl(houseUrl)
          .then((house: any) => this.item.allegianceNames.push(house.name))
          .catch(err => console.log(err));
      });
      this.item.books.forEach(bookUrl => {
        this._iceAndFireService.getItemByUrl(bookUrl)
          .then((book: any) => this.item.bookNames.push(book.name))
          .catch(err => console.log(err));
      });
      if (this.item.father) {
        this._iceAndFireService.getItemByUrl(this.item.father)
          .then((character: any) => this.item.fatherName = character.name)
          .catch(err => console.log(err));
      }
      if (this.item.mother) {
        this._iceAndFireService.getItemByUrl(this.item.mother)
          .then((character: any) => this.item.motherName = character.name)
          .catch(err => console.log(err));
      }
    } else if (this.item.type === 'houses') {
      // clear arrays if it contains blank data
      if (this.item.titles.length === 1 && !this.item.titles[0]) {
        this.item.titles = [];
      }
      if (this.item.seats.length === 1 && !this.item.seats[0]) {
        this.item.seats = [];
      }

      // create properties to show in details
      this.item.founderName = '';
      this.item.overlordName = '';
      this.item.currentLordName = '';
      this.item.heirName = '';

      // fetch name(s) from url(s)
      if (this.item.founder) {
        this._iceAndFireService.getItemByUrl(this.item.founder)
          .then((character: any) => this.item.founderName = character.name)
          .catch(err => console.log(err));
      }
      if (this.item.overlord) {
        this._iceAndFireService.getItemByUrl(this.item.overlord)
          .then((house: any) => this.item.overlordName = house.name)
          .catch(err => console.log(err));
      }
      if (this.item.currentLord) {
        this._iceAndFireService.getItemByUrl(this.item.currentLord)
          .then((character: any) => this.item.currentLordName = character.name)
          .catch(err => console.log(err));
      }
      if (this.item.heir) {
        this._iceAndFireService.getItemByUrl(this.item.heir)
          .then((character: any) => this.item.heirName = character.name)
          .catch(err => console.log(err));
      }
    }
  }

  joinArray(array) {
    if (array.length === 1) {
      return array[0];
    } else {
      return array.slice(0, -1).join(', ') + ', and ' + array.slice(-1);
    }
  }

  goBack() {
    this._location.back();
  }

}

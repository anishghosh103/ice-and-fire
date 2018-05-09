import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IceAndFireService {

  private list = [];
  private filter = {
    type: [true, false, false, false],
    text: ''
  };

  private baseUrl = 'https://www.anapioficeandfire.com/api';

  constructor(private _http: HttpClient) { }

  private _getList(type: string, callback) {
    this._http.get(`${this.baseUrl}/${type}?&pageSize=50`)
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            response = response.map((item, index) => {
              item.id = `${type[0]}-${index + 1}`;
              item.orderKey = item.name === '' ? item.aliases[0] : item.name;
              item.type = type;
              return item;
            }).forEach(item => callback(null, item));
            this.list = this.list.concat(...response);
          }
        },
        err => callback(err)
      );
  }

  getList(callback) {
    if (this.list.length === 0) {
      this._getList('books', callback);
      this._getList('characters', callback);
      this._getList('houses', callback);
    } else {
      callback(null, this.list, true);
    }
  }

  getItemById(id: string) {
    return new Promise((resolve, reject) => {
      const item = this.list.find(x => x.id === id);
      if (item) {
        resolve(item);
      } else {
        const type = id[0] === 'b' ? 'books' : id[0] === 'c' ? 'characters' : 'houses';
        const number = id.substr(2);
        this._http.get(`${this.baseUrl}/${type}/${number}`)
          .subscribe(
            (response: any) => {
              response.id = id;
              response.type = type;
              response.orderKey = response.name === '' ? response.aliases[0] : response.name;
              resolve(response);
            },
            err => reject(err)
          );
      }
    });
  }

  getItemByUrl(url: string) {
    return new Promise((resolve, reject) => {
      this._http.get(url)
        .subscribe(
          response => resolve(response),
          err => reject(err)
        );
    });
  }

  getFilters() {
    return this.filter;
  }

  setFilters(filter: any) {
    this.filter = filter;
  }

}

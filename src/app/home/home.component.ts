import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IceAndFireService } from '../ice-and-fire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public list = [];
  public allItems = [];

  public filter: any;

  constructor(private _iceAndFireService: IceAndFireService, private _router: Router) { }

  ngOnInit() {
    this.filter = this._iceAndFireService.getFilters();
    this._iceAndFireService.getList((err, data, fullList) => {
      if (err) { return console.log(err); }
      if (fullList) {
        this.allItems = data;
      } else {
        this.allItems.push(data);
      }
      this.allItems = this.allItems.sort((a, b) => a.orderKey > b.orderKey ? 1 : -1);
      this.filterList();
    });
  }

  ngOnDestroy(): void {
    this._iceAndFireService.setFilters(this.filter);
  }

  showDetails(id: string) {
    // go to the details view
    this._router.navigate(['/details', id]);
  }

  showFilteredText(text: string) {
    // bold the text part which has the filtering text
    const index = text.toUpperCase().indexOf(this.filter.text.toUpperCase());
    const length = this.filter.text.length;
    return `${text.substr(0, index)}<b>${text.substr(index, length)}</b>${text.substr(index + length)}`;
  }

  filterList() {
    // filter by type
    this.list = this.allItems.filter(item => {
      if (this.filter.type[0]) { return true; }

      if (item.type === 'books' && !this.filter.type[1]) {
        return false;
      } else if (item.type === 'characters' && !this.filter.type[2]) {
        return false;
      } else if (item.type === 'houses' && !this.filter.type[3]) {
        return false;
      }
      return true;
    });

    // filter by query
    this.list = this.list.filter(item => {
      return item.orderKey.toUpperCase().indexOf(this.filter.text.toUpperCase()) !== -1;
    });
  }

}

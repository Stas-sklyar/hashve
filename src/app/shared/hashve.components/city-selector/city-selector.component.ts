import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service';
import { City } from '../../../business/model/city.model';
import { CityService } from '../../service/city.service';


@Component({
  selector: 'app-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.scss']
})
export class CitySelectorComponent implements OnInit {
  public showHelp = false;
  public cityList: Array<City> = [];
  public cityFilteredList: Array<City> = [];
  curLang: string = 'heb';
  @Input() selectedCity: City;
  @Input() navigateLink = 'חנויות_פרחים_';

  constructor(
    protected cityService: CityService,
    protected appService: AppService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.cityService.getCitiesWithoutLogin().subscribe((data: any) => {
      this.cityList = data.data;
      this.cityList.sort((a, b) => {
        if (a.inPopular || b.inPopular) {
          if (a.inPopular && !b.inPopular) {
            return -1;
          } else if (!a.inPopular && b.inPopular) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a.name[this.curLang] > b.name[this.curLang]) {
            return 1
          } else if (a.name[this.curLang] < b.name[this.curLang]) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      this.cityFilteredList = this.cityList;
    });
  }

  public ddlStatus: string = 'none';
  public tmpCity: City;

  filterCities($event) {
    const value = $event.target.value;
    const toCompare = value.toLowerCase();
    this.cityFilteredList = [];

    this.cityFilteredList = this.cityList.filter((item) => {
      return this.checkInside(item, toCompare);
    });

    if (this.cityFilteredList.length === 1) {
      this.tmpCity = this.cityFilteredList[0];
    }

  }

  private checkInside(item: any, term: string) {
    for (let property in item) {
      if (item[property] === null || item[property] == undefined) {
        continue;
      }
      if (typeof item[property] === 'object') {
        if (this.checkInside(item[property], term)) {
          return true;
        }
      } else if (item[property].toString().toLowerCase().includes(term)) {
        return true;
      }
    }
    return false;
  }

  showCityList($event) {
    if ($event.type === 'focus') {
      setTimeout(() => {
        this.ddlStatus = 'block';
      }, 500);
    } else {
      setTimeout(() => {
        this.ddlStatus = 'none';
      }, 500);
    }
  }

  confirmCity(): void {
    if (!this.selectedCity) { return; }
    this.route.navigateByUrl(`/${this.navigateLink}${this.selectedCity.name.heb.replace(/\s/g, '_')}`);
  }

  selectCity(city: City): void {
    this.selectedCity = city;
  }
}

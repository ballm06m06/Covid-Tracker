import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { TimeSeriesData } from 'src/app/models/time-series-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: TimeSeriesData[];
  dateWiseData;
  loading = true;
  options: {
    height: 500,
    animation: {
      duration: 1000,
      easing: 'out',
    },
  }

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getTimeSeriesGlobalData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country)
        })
      }))
    ).subscribe(
      {
        complete: () => {
          this.updateValues('US')
          this.loading = false;
        }
      }
    )
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
        this.totalConfirmed = cs.confirmed;
      }
    })

    this.selectedCountryData = this.dateWiseData[country];
    // console.log(this.selectedCountryData);
  }
}

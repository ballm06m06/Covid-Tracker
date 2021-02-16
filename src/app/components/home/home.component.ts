import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  datatable = [];

  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    GeoChart: "GeoChart",
    height: 500,
    width: 900, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }
  }

  constructor(private dataservice: DataServiceService) { }

  initChart(caseType :string) {

    // init datatable everytime 
    this.datatable = [];

    this.globalData.forEach(cs=>{
      
      let value:number;
      
      if(caseType == 'c'){
        if(cs.confirmed > 50000){
          value = cs.confirmed;
        }
      }
      if(caseType == 'a'){
        if(cs.active > 2000){
          value = cs.active;
        }
      }
      if(caseType == 'd'){
        if(cs.deaths > 1000){
          value = cs.deaths;
        }
      }
      if(caseType == 'r'){
        if(cs.recovered > 2000){
          value = cs.recovered;
        }
      }
      this.datatable.push([cs.country, value]);
    });
  }

  updateChart(input: HTMLInputElement){
    console.log(input.value);
    this.initChart(input.value);
  }

  ngOnInit(): void {

    this.dataservice.getGlobalData().subscribe(
      {
        next: (result) => {
          // console.log(result);
          this.globalData = result;

          result.forEach(cs => {
            if (!Number.isNaN(cs.confirmed)) {
              this.totalActive += cs.active;
              this.totalConfirmed += cs.confirmed;
              this.totalDeaths += cs.deaths;
              this.totalRecovered += cs.recovered;
            }
          })
          this.initChart('c');
        }
      }
    );
  }
}

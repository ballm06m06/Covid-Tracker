import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';
import { TimeSeriesData } from '../models/time-series-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/01-28-2021.csv';
  private timeSeries_globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  
  constructor(private http: HttpClient) { }


  getTimeSeriesGlobalData(){
    return this.http.get(this.timeSeries_globalDataUrl, {responseType : 'text'})
      .pipe(map(result => {
        let rows = result.split('\n');
        // console.log(rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);

        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0, 4);
          console.log(con, cols);
          mainData[con] = [];
          cols.forEach((value, index)=>{
            let dw : TimeSeriesData ={
              cases : +value,
              country : con,
              date: new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw);
          })
        })
        return mainData;
      }));
  }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType : 'text'}).pipe(
      map(result=>{
        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');

        // We don't need the forst element
        rows.splice(0, 1);
        
        rows.forEach(row => {
          
          // Use regex to avoid whitespace in combined_key column 
          let cols = row.split(/,(?=\S)/);

          let cs = {
            country : cols[3],
            // Use plus to covert string into number
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10]
          };

          let temp:GlobalDataSummary = raw[cs.country];
          // If(temp) means if we encounter same country
          if(temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            
            raw[cs.country] = temp;
          }else{
            raw[cs.country] = cs;
          }
        });        
        return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }
}

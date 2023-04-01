import { LightningElement, api, wire, track } from 'lwc';
import getSearchedCoursesWraps from '@salesforce/apex/courseController.searchRecordWraps';

import { refreshApex } from '@salesforce/apex'; 

export default class CourseSelectorWrapped extends LightningElement {
    courseList = [];
    error;

    @track searchKey=''; //initialising, just in case
    
    handleSearch(event){
        event.preventDefault();
        this.searchKey = event.target.value;
    }

    @wire(getSearchedCoursesWraps, { searchKeyWord : '$searchKey'})wireRecs({data, error}){
        if(data){
            this.courseList = data;
            this.error = undefined;
            console.log(this.courseList);
        }
        else if(error){
            this.courseList = undefined;
            this.error = error;
        }
    };
    handleOnRefreshCall(evt){
        evt.preventDefault();
        
        if(evt.detail.refresh == true){
            console.log('might refresh');
            refreshApex(this.courseList);
        }
        
    }
    connectedCallback(){
        console.log(' selector connected');
        refreshApex(this.courseList);
    }
}
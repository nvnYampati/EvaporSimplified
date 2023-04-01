import { LightningElement, wire, track } from 'lwc';
import getCourses from '@salesforce/apex/courseController.allRecords';
import getSearchedCourses from '@salesforce/apex/courseController.searchRecord';


export default class CourseSelector extends LightningElement {
    courseList = [];  // not initialising this always throws an error when wiring data transactionally
    error;

    @track searchKey=''; //initialising, just in case

    //@wire(getCourses)courseList;
    //disabled this, need to try methods with JS filtering, transactional provisioning isnt working
    
    handleSearch(event){
        event.preventDefault();
        this.searchKey = event.target.value;
    }

    @wire(getSearchedCourses, { searchKeyWord : '$searchKey'}) courseList; 
    
}
    // @wire(getSearchedCourses, { searchKeyWord : '$searchKey' })wiredData({data, error}){
    //     if(data){
    //         this.courseList = data;
    //         this.error = undefined;
    //     }
    //     else if(error){
    //         this.error = error;
    //         this.courseList = undefined;
    //     }
    // }



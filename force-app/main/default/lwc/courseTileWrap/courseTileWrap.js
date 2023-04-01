import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import inModal from 'c/institutionModal';
import createFavourite from '@salesforce/apex/courseController.createFavourite';
import deleteFavourite from '@salesforce/apex/courseController.deleteFavourite';

export default class CourseTileWrap extends NavigationMixin(LightningElement) {
    // _courseWrap;
    // @api set courseWrap(value){
    //     if(this._courseWrap.isLiked!=value.isLiked){
    //         this._courseWrap = value;
    //     }
    // } get courseWrap(){
    //     return this._courseWrap;
    // }
    @api courseWrap;
    likeIcon = 'custom:custom1';
    initIsLike = false;
    // isLiked = false;
    // favIcon = '';
    // likeTip = '';
    
    get isLiked(){
        return this.courseWrap.isLiked;
    }
    set isLiked(val){
        console.log(' setter value '+val+' and isLiked '+this.isLiked);
        this.courseWrap.isLiked = val;
        console.log(' courseWrap.isLiked setter value '+this.isLiked);
    }
    
    get favIcon(){
        return this.courseWrap.isLiked  ? 'action:approval' : 'custom:custom1';
    }
    set favIcon(value){
        this.favIcon = value;
        console.log('favIcon setter value '+value + 'favIcon '+this.favIcon);
    }

    get likeTip(){
        return this.courseWrap.isLiked  ? 'Liked': 'Like';
    }

    setIcon(){
        if (this.isLiked == true) {
            this.favIcon = 'action:approval';    
            this.likeTip = 'Liked';
        }
        else if (this.isLiked == false) {
            this.favIcon = 'custom:custom1';
            this.likeTip = 'Like';
        }
    }
    // connectedCallback() {92466407
    //     console.log('connected');
    //     this.isLiked = this.courseWrap.isLiked ;
    //     this.setIcon();
    // }
    
    // renderedCallback(){
    //     console.log('rendered');
    //     this.setIcon();
    // }
    // disconnectedCallback(){
    //     this.dispatchEvent(
    //         new CustomEvent( 'refreshcall', 
    //                 {
    //                     detail : {
    //                         refresh : true
    //                     }
    //                 }
    //         )
    //     );
    //     console.log('disconnected');
    // }
    handleFavourite(){
        //console.log('clicked');
        if(this.isLiked === true){
            console.log('1 this.isLiked before ' + this.isLiked);
            console.log('2 favIcon before ' + this.favIcon);
            deleteFavourite( {courseId : this.courseWrap.CourseId} ).then( ()=>{
                console.log('3 un-favourited');
                console.log('4 before is liked '+this.isLiked);
                dispatchEvent(                 //notify status
                    new ShowToastEvent({
                        title: 'Removed Successfully!',
                        message: 'Course removed from Favourites!',
                        variant: 'error'
                    })
                );
                console.log('5 after this.isLiked '+ this.isLiked );
                this.isLiked = false;   // uncaught in a promise
                //this.courseWrap.isLiked = false ;
                //this.favIcon = 'custom:custom1';
                console.log('6 after likeIcon clicked ' + this.favIcon);

                }
            );
            this.favIcon = 'custom:custom1';   
        } else if(this.isLiked === false){
            console.log('1 this.isLiked before ' + this.isLiked);
            console.log('2 favIcon before ' + this.favIcon);
            createFavourite( {courseId : this.courseWrap.CourseId} ).then( ()=>{
                console.log('3 favourited');
                console.log('4 before is liked '+this.isLiked);
                dispatchEvent(                 //notify status
                    new ShowToastEvent({
                        title: 'Added Successfully!',
                        message: 'Course added to Favourites!',
                        variant: 'success'
                    })
                ); 
                console.log('5 after this.isLiked '+ this.isLiked );
                this.isLiked = true; // uncaught in a promise
                //this.courseWrap.isLiked = true;
                //this.favIcon = 'action:approval';
                console.log('6 after likeIcon clicked ' + this.favIcon); 
            }  
            ).catch( (error) => {
                console.log(error);
            });
        }
    }
   
    // connectedCallback() {
    //     console.log('connected');
    //     // console.log(this.courseItem);
    //     // if (this.isLiked == true) {
    //     //     this.likeIcon = 'action:approval';    
    //     //     this.likeTip = 'Liked';
    //     // }
    //     // else if (this.isLiked == false) {
    //     //     this.likeIcon = 'custom:custom1';
    //     //     this.likeTip = 'Like';
    //     // }
    // }
    // renderedCallback(){
    //     console.log('rendered');
    //     // console.log(this.courseWrap);
    //     // if (this.isLiked == true) {
    //     //     this.likeIcon = 'action:approval';    
    //     //     this.likeTip = 'Liked';
    //     // }
    //     // else if (this.isLiked == false) {
    //     //     this.likeIcon = 'custom:custom1';
    //     //     this.likeTip = 'Like';
    //     // }
    // }


    

    // async handleDPClick() {                //make to course record page
    //     const result = await inModal.open({
    //         size: 'small',
    //         description: 'Mission and Vision of the Institution',
    //         courseId: this.courseWrap.CourseId,
    //     });
    // }

    handleCourseClick() {
        console.log(this.courseWrap.CourseId);
        this[NavigationMixin.Navigate]({        //navigation mixin in action
            type: 'standard__recordPage',
            attributes: {
                recordId: this.courseWrap.CourseId,     //navigates to this record page
                objectApiName: 'Course__c',   //hardcoded, replace with objectAPIName
                actionName: 'view'
            }
        }
        );
    }

    // async handleInstitute() {              //opens a modal to display data on institute
    //     const result = await inModal.open({
    //         size: 'small',
    //         description: 'Mission and Vision of the Institution',
    //         courseId: this.courseItem.CourseId,
    //     });
    // }
}
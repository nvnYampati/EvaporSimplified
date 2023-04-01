import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//import courseObject from '@salesforce/schema/Favourite__c';
//import { deleteRecord, createRecord } from 'lightning/uiRecordApi';
//import favObject from '@salesforce/schema/Favourite__c';

import inModal from 'c/institutionModal';
import createFavourite from '@salesforce/apex/courseController.createFavourite';
import deleteFavourite from '@salesforce/apex/courseController.deleteFavourite';
import isFavourite from '@salesforce/apex/courseController.isFavourite';

export default class CourseTile extends NavigationMixin(LightningElement) {

    @api courseItem;
    error;
    isLiked = false;
    likeIcon;
    likeTip;
    //@wire (isFavourite, { courseId : courseItem.Id }) isLiked;
    connectedCallback() {
        isFavourite({ courseId: this.courseItem.Id }).then(
            (data) => {
                this.isLiked = data;
            }
        ).catch(
            (error) => {
                this.error = error;
            }
        );
        console.log(this.isLiked);
        if (this.isLiked == true) {
            this.likeIcon = 'action:approval';    
            this.likeTip = 'Liked';
        }
        else if (this.isLiked == false) {
            this.likeIcon = 'custom:custom1';
            this.likeTip = 'Like';
        }
    }
    renderedCallback(){
        if (this.isLiked == true) {
            this.likeIcon = 'action:approval';    
            this.likeTip = 'Liked';
        }
        else if (this.isLiked == false) {
            this.likeIcon = 'custom:custom1';
            this.likeTip = 'Like';
        }
    }

    handleLike() {                             //handles like button
        
        if (this.isLiked === false) {              //create favourite record

            console.log(this.courseItem.Id);
            createFavourite({ courseId: this.courseItem.Id }).then((data, error) => {

                console.log('After Resolve');
                this.likeIcon = 'action:approval';    //change icon
                dispatchEvent(                 //notify status
                    new ShowToastEvent({
                        title: 'Added Successfully!',
                        message: 'Course added to Favourites!',
                        variant: 'success'
                    })
                );
            });
            this.isLiked = true;
        } 
        
        else if (this.isLiked === true) {    //delete favourite record
            deleteFavourite({ courseId: this.courseItem.Id }).then((data, error) => {
                console.log('After Resolve');
                this.likeIcon = 'custom:custom1';    //change icon
                dispatchEvent(                 //notify status
                    new ShowToastEvent({
                        title: 'Removed Successfully!',
                        message: 'Course removed from Favourites!',
                        variant: 'error'
                    })
                );
            });
            this.isLiked = false;
        }
    }

    async handleDPClick() {                //make to course record page
        const result = await inModal.open({
            size: 'small',
            description: 'Mission and Vision of the Institution',
            courseId: this.courseItem.Id,
        });
    }

    handleCourseClick() {
        this[NavigationMixin.Navigate]({        //navigation mixin in action
            type: 'standard__recordPage',
            attributes: {
                recordId: this.courseItem.Id,     //navigates to this record page
                objectApiName: 'Course__c',   //hardcoded, replace with objectAPIName
                actionName: 'view'
            }
        }
        );
    }

    async handleInstitute() {              //opens a modal to display data on institute
        const result = await inModal.open({
            size: 'small',
            description: 'Mission and Vision of the Institution',
            courseId: this.courseItem.Id,
        });
    }

}
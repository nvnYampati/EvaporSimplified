public class courseController {
    

    @AuraEnabled(cacheable=true)
    public static list<Course__c> allRecords(){
        return [SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, Institution__r.Name FROM Course__c];
    }
    
    @AuraEnabled(cacheable=true)
    public static list<Course__c> searchRecord(String searchKeyWord){
        String searchString = '%'+searchKeyWord+'%';
        system.debug(searchString);
        List<Course__c> courseList = [SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, Institution__r.Name FROM Course__c WHERE Name LIKE :searchString];
        system.debug(courseList);
        return courseList;
    }

    @AuraEnabled(cacheable=true)
    public static Institution__c getInstitution(id courseId){
        //Course__c course = [SELECT Id, Institution__r.Id FROM Course__c][0];
        //Joined query is made below
        return [SELECT Name, Description__c FROM Institution__c WHERE Id =: [SELECT Id, Institution__r.Id FROM Course__c][0].Institution__r.Id];
    }
    
    @AuraEnabled(cacheable=false)
    public static boolean isFavourite(Id courseId){	//working, tested on anon
        boolean isLiked = false;
        Id currentUserId = UserInfo.getUserId();
        integer Likes = [SELECT Id, Course__r.Id, CustomerUser__r.Id FROM Favourite__c WHERE Course__r.Id =:courseId AND CustomerUser__r.Id =: currentUserId].size();
        if(Likes>0){
            isLiked = true;
        }
       return isLiked; 
    }
    @AuraEnabled(cacheable=false)
    public static void createFavourite(Id courseId){	//working, tested on anon
        Favourite__c newFav = new Favourite__c(
        	CustomerUser__c = UserInfo.getUserId(),
        	Course__c = courseId
     	);
       insert newFav;
    }
        
    @AuraEnabled(cacheable=false)
    public static void deleteFavourite(Id courseId){	//working, tested on anon
       	Id currentUserId = UserInfo.getUserId();
        List<Favourite__c> favRecords = [SELECT Id, Course__r.Id, CustomerUser__r.Id FROM Favourite__c WHERE Course__r.Id =:courseId AND CustomerUser__r.Id =: currentUserId];
        delete favRecords;
    }
    
    @AuraEnabled
    public static void updateLikeCount(Id courseId, Boolean isLiked) {
        Course__c record = [SELECT Id, Name FROM Course__c WHERE Id = :courseId];
        if (isLiked) {
            record.Like_Count__c += 1;
            Favourite__c fav = new Favourite__c();
            
        } else {
            record.Like_Count__c -= 1;
            //query favourite-course record
            
        }
        update record;
    }
    
    public class courseWrap{	//primitive data goes below
        @AuraEnabled
        public string Name {get;set;}
        @AuraEnabled
        public Id CourseId {get;set;}
        @AuraEnabled
        public string InstitutionName {get;set;}
        @AuraEnabled
        public Id InstitutionId {get;set;}
        @AuraEnabled
        public string DisplayPicture {get;set;}
        @AuraEnabled
        public string CoverPicture {get;set;}
        @AuraEnabled
        public decimal Fee {get;set;}
        @AuraEnabled
        public boolean isLiked {get;set;}
        
        public courseWrap(){}
        
        public courseWrap(Course__c course){
            this.Name = course.Name;
            this.CourseId = course.Id;
            this.InstitutionName = course.Institution__r.Name;
            this.InstitutionId = course.Institution__r.Id;
            this.CoverPicture = course.CoverPicture__c;
            this.DisplayPicture = course.DisplayPicture__c;
            this.Fee = course.Fee__c;
        }
        
    }	
    
    @AuraEnabled(cacheable=true)
    public static list<courseWrap> allRecordWraps(){
        //Id currentUserId = UserInfo.getUserId();
        //list<Favourite__c> Likes = [SELECT Id, Course__r.Id, CustomerUser__r.Id FROM Favourite__c WHERE CustomerUser__r.Id =: currentUserId];
        list<courseWrap> cwList = new list<courseWrap>(); //change the below soql query in the loop to render different queries
        for(Course__c course : [SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, (SELECT Id FROM Favourites__r WHERE CustomerUser__c = :UserInfo.getUserId()), Institution__r.Name FROM Course__c]){
            courseWrap cw = new courseWrap( course );
            if(course.Favourites__r.size() > 0){
            	cw.isLiked = true;
            } else{
                cw.isLiked = false;     
            }
            cwList.add(cw);
        }
        
        return cwList;
}
    //SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, (SELECT Id FROM Favourites__r WHERE CustomerUser__c = '0052w00000EgekTAAR'), Institution__r.Name FROM Course__c
    @AuraEnabled(cacheable=true)
    public static list<courseWrap> searchRecordWraps(String searchKeyWord){
        String searchString = '%'+searchKeyWord+'%';
        system.debug(searchString);
        list<courseWrap> cwList = new list<courseWrap>(); //change the below soql query in the loop to render different queries
        for(Course__c course : [SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c,(SELECT Id FROM Favourites__r WHERE CustomerUser__c = :UserInfo.getUserId()), Institution__r.Name FROM Course__c WHERE Name LIKE :searchString]){
            courseWrap cw = new courseWrap(course);
            if(course.Favourites__r.size() > 0){
            	cw.isLiked = true;
            } else{
                cw.isLiked = false;     
            }
            system.debug(cw);			//flag
            cwList.add(cw);
        }
        return cwList;
    }

}	
	
	

//use below query to get a particular course related to the Institute   R - a7T2w0000000I8sEAE
//SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, Institution__r.Name FROM Course__c WHERE Institution__r.Id = 'a7S2w0000008dC9EAI'
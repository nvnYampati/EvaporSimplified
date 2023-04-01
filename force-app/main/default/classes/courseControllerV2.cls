public class courseControllerV2 {
	@AuraEnabled(cacheable=true)
    public static list<Course__c> getAllRecords(){
        return [SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, Institution__r.Name FROM Course__c];
    }
    
    @AuraEnabled(cacheable=true)
    public static list<Course__c> getSearchedRecord(String KeyWord){
        String searchString = '%'+KeyWord+'%';
        system.debug(searchString);
        List<Course__c> courseList = [SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, Institution__r.Name FROM Course__c WHERE Name LIKE :searchString];
        system.debug(courseList);
        return courseList;
    }
}
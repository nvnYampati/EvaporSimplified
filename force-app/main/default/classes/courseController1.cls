public class courseController1 {
    public static list<Course__c> allRecords(){
        return [SELECT Id, Name, Fee__c, DisplayPicture__c, CoverPicture__c, Institution__r.Name FROM Course__c];
    }
}
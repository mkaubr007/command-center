export class AssigneeDropdownCacheConstants {
    public static readonly MATCH = {};
    public static readonly PROJECTION = { "_id": 1, "name": 1, "meta": 1 };
    public static readonly SORT = { "name.first": 1 };

    public static readonly ASSGINEE_LIST = [{
        "name": {
          "first": "aman",
          "last": "Kumar"
        },
        "meta": {
          "profilePic": "../../../../../../assets/images/no-img-user.svg",
          "uniqueName": "test",
          "description": "this is description"
        },
        "_id": "5e944ed15aed5b1b722f6b83"
      }];

      public static readonly ASSIGNEES = [{
        name: 'aman Kumar',
        imageUrl: '../../../../../../assets/images/no-img-user.svg',
        id: '5e944ed15aed5b1b722f6b83'
    }];

    public static readonly DropDownElement = {assignedTo:{
      name: 'kirti',
      imageUrl: '../../../../../../assets/images/no-img-user.svg',
      id: '5e944ed15aed5b1b722f6b83'}
  };

    public static readonly ASSIGNEE_RESPONSE = {
      "message": "Success",
      "statusCode": 200,
      "data": AssigneeDropdownCacheConstants.ASSGINEE_LIST[0]
    }

}
export class JiraTestConstants {

    public static readonly initFormData = {
        "data": {
            "name": "test",
            "detail": "test detail"
        }
    }

    public static readonly getIssueTypesResult = {
        "expand": "projects",
        "projects": [
            {
                "expand": "issuetypes",
                "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/project/10408",
                "id": "10408",
                "key": "ETL",
                "name": "ETL",
                "avatarUrls": {
                    "48x48": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?pid=10408&avatarId=10808",
                    "24x24": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?size=small&s=small&pid=10408&avatarId=10808",
                    "16x16": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?size=xsmall&s=xsmall&pid=10408&avatarId=10808",
                    "32x32": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?size=medium&s=medium&pid=10408&avatarId=10808"
                },
                "issuetypes": [
                    {
                        "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/issuetype/10158",
                        "id": "10158",
                        "description": "Creation of new ETL process or function.",
                        "iconUrl": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/viewavatar?size=medium&avatarId=10817&avatarType=issuetype",
                        "name": "New Process",
                        "untranslatedName": "New Process",
                        "subtask": false,
                        "expand": "fields",
                        "fields": {
                            "summary": {
                                "required": true,
                                "schema": {
                                    "type": "string",
                                    "system": "summary"
                                },
                                "name": "Summary",
                                "key": "summary",
                                "hasDefaultValue": false,
                                "operations": [
                                    "set"
                                ]
                            },
                            "issuetype": {
                                "required": true,
                                "schema": {
                                    "type": "issuetype",
                                    "system": "issuetype"
                                },
                                "name": "Issue Type",
                                "key": "issuetype",
                                "hasDefaultValue": false,
                                "operations": [],
                                "allowedValues": [
                                    {
                                        "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/issuetype/10158",
                                        "id": "10158",
                                        "description": "Creation of new ETL process or function.",
                                        "iconUrl": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/viewavatar?size=medium&avatarId=10817&avatarType=issuetype",
                                        "name": "New Process",
                                        "subtask": false,
                                        "avatarId": 10817
                                    }
                                ]
                            },
                            "description": {
                                "required": false,
                                "schema": {
                                    "type": "string",
                                    "system": "description"
                                },
                                "name": "Description",
                                "key": "description",
                                "hasDefaultValue": false,
                                "operations": [
                                    "set"
                                ]
                            },
                            "project": {
                                "required": true,
                                "schema": {
                                    "type": "project",
                                    "system": "project"
                                },
                                "name": "Project",
                                "key": "project",
                                "hasDefaultValue": false,
                                "operations": [
                                    "set"
                                ],
                                "allowedValues": [
                                    {
                                        "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/project/10408",
                                        "id": "10408",
                                        "key": "ETL",
                                        "name": "ETL",
                                        "projectTypeKey": "software",
                                        "simplified": false,
                                        "avatarUrls": {
                                            "48x48": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?pid=10408&avatarId=10808",
                                            "24x24": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?size=small&s=small&pid=10408&avatarId=10808",
                                            "16x16": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?size=xsmall&s=xsmall&pid=10408&avatarId=10808",
                                            "32x32": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/secure/projectavatar?size=medium&s=medium&pid=10408&avatarId=10808"
                                        }
                                    }
                                ]
                            },
                            "fixVersions": {
                                "required": false,
                                "schema": {
                                    "type": "array",
                                    "items": "version",
                                    "system": "fixVersions"
                                },
                                "name": "Fix versions",
                                "key": "fixVersions",
                                "hasDefaultValue": false,
                                "operations": [
                                    "set",
                                    "add",
                                    "remove"
                                ],
                                "priority": {
                                    "required": false,
                                    "schema": {
                                        "type": "priority",
                                        "system": "priority"
                                    },
                                    "name": "Priority",
                                    "key": "priority",
                                    "hasDefaultValue": true,
                                    "operations": [
                                        "set"
                                    ],
                                    "allowedValues": [
                                        {
                                            "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/priority/1",
                                            "iconUrl": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/images/icons/priorities/major.svg",
                                            "name": "P1",
                                            "id": "1"
                                        }
                                    ],
                                    "defaultValue": {
                                        "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/priority/10000",
                                        "iconUrl": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/images/icons/priorities/trivial.svg",
                                        "name": "None",
                                        "id": "10000"
                                    }
                                },
                                "customfield_10892": {
                                    "required": false,
                                    "schema": {
                                        "type": "option",
                                        "custom": "com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons",
                                        "customId": 10892
                                    },
                                    "name": "Complexity",
                                    "key": "customfield_10892",
                                    "hasDefaultValue": false,
                                    "operations": [
                                        "set"
                                    ],
                                    "allowedValues": [
                                        {
                                            "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/customFieldOption/10486",
                                            "value": "Complex",
                                            "id": "10486"
                                        }
                                    ]
                                },
                                "labels": {
                                    "required": false,
                                    "schema": {
                                        "type": "array",
                                        "items": "string",
                                        "system": "labels"
                                    },
                                    "name": "Labels",
                                    "key": "labels",
                                    "autoCompleteUrl": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/1.0/labels/suggest?query=",
                                    "hasDefaultValue": false,
                                    "operations": [
                                        "add",
                                        "set",
                                        "remove"
                                    ]
                                },
                                "customfield_10017": {
                                    "required": false,
                                    "schema": {
                                        "type": "any",
                                        "custom": "com.pyxis.greenhopper.jira:gh-epic-link",
                                        "customId": 10017
                                    },
                                    "name": "Epic Link",
                                    "key": "customfield_10017",
                                    "hasDefaultValue": false,
                                    "operations": [
                                        "set"
                                    ]
                                },
                                "attachment": {
                                    "required": false,
                                    "schema": {
                                        "type": "array",
                                        "items": "attachment",
                                        "system": "attachment"
                                    },
                                    "name": "Attachment",
                                    "key": "attachment",
                                    "hasDefaultValue": false,
                                    "operations": []
                                },
                                "customfield_10903": {
                                    "required": true,
                                    "schema": {
                                        "type": "option",
                                        "custom": "com.atlassian.jira.plugin.system.customfieldtypes:select",
                                        "customId": 10903
                                    },
                                    "name": "Phase",
                                    "key": "customfield_10903",
                                    "hasDefaultValue": false,
                                    "operations": [
                                        "set"
                                    ],
                                    "allowedValues": [
                                        {
                                            "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/customFieldOption/10503",
                                            "value": "Implementation",
                                            "id": "10503"
                                        }
                                    ]
                                },
                                "customfield_10806": {
                                    "required": true,
                                    "schema": {
                                        "type": "array",
                                        "items": "option",
                                        "custom": "com.atlassian.jira.plugin.system.customfieldtypes:multiselect",
                                        "customId": 10806
                                    },
                                    "name": "Client",
                                    "key": "customfield_10806",
                                    "hasDefaultValue": false,
                                    "operations": [
                                        "add",
                                        "set",
                                        "remove"
                                    ],
                                    "allowedValues": [
                                        {
                                            "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/customFieldOption/10501",
                                            "value": "HLTHCO2",
                                            "id": "10501"
                                        }
                                    ]
                                },
                                "issuelinks": {
                                    "required": false,
                                    "schema": {
                                        "type": "array",
                                        "items": "issuelinks",
                                        "system": "issuelinks"
                                    },
                                    "name": "Linked Issues",
                                    "key": "issuelinks",
                                    "autoCompleteUrl": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/issue/picker?currentProjectId=&showSubTaskParent=true&showSubTasks=true&currentIssueKey=null&query=",
                                    "hasDefaultValue": false,
                                    "operations": [
                                        "add"
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }

    public static readonly createTicketData = {
        "update": {},
        "fields": {
            "summary": "test",
            "description": { "type": "doc", "version": 1, "content": [{ "type": "paragraph", "content": [{ "text": "test detail", "type": "text" }] }] },
            "issuetype": { "id": "10158" },
            "project": { "id": 10408 }
        },
        "assignee": undefined,
        "errorDetail": { "_id": undefined, "status": "To Do", "resolution": null }
    };

    public static readonly jiraSuccessResponse = {
      data: {},
      message: 'success'
    };

    public static readonly getIssueTypeResponse = {
        data: JiraTestConstants.getIssueTypesResult,
        message: "Success",
        statusCode: 200
    }

    public static readonly getIssueTypeErrorResponse = {
        error: 'some error',
        message: 'Failure',
        statusCode: 400,
      };

    public static readonly issueTypeField = {
        "required": true,
        "schema": {
            "type": "option",
            "custom": "com.atlassian.jira.plugin.system.customfieldtypes:select",
            "customId": 10903
        },
        "name": "Phase",
        "key": "customfield_10903",
        "hasDefaultValue": false,
        "operations": [
            "set"
        ],
        "allowedValues": [
            {
                "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/2/customFieldOption/10503",
                "value": "Implementation",
                "id": "10503"
            }
        ]
    }

    public static readonly getJiraUsersResult = [
        {
            "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/3/user?accountId=5d5a8e060b82fa0c3ca3cebb",
            "accountId": "5d5a8e060b82fa0c3ca3cebb",
            "accountType": "atlassian",
            "emailAddress": "abhinav.agrawal@quovantis.com",
            "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/69c6ec2000c59808599eb724aaf5b90f?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAA-3.png",
                "24x24": "https://secure.gravatar.com/avatar/69c6ec2000c59808599eb724aaf5b90f?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAA-3.png",
                "16x16": "https://secure.gravatar.com/avatar/69c6ec2000c59808599eb724aaf5b90f?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAA-3.png",
                "32x32": "https://secure.gravatar.com/avatar/69c6ec2000c59808599eb724aaf5b90f?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAA-3.png"
            },
            "displayName": "Abhinav Agrawal",
            "active": true,
            "timeZone": "America/Chicago",
            "locale": "en_US"
        },
        {
            "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/3/user?accountId=5db94c91b8463d0c4fb6c7a2",
            "accountId": "5db94c91b8463d0c4fb6c7a2",
            "accountType": "atlassian",
            "emailAddress": "aakriti.koul@quovantis.com",
            "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/153fbbf986fd7c2592c6d2f96cd53d79?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAK-1.png",
                "24x24": "https://secure.gravatar.com/avatar/153fbbf986fd7c2592c6d2f96cd53d79?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAK-1.png",
                "16x16": "https://secure.gravatar.com/avatar/153fbbf986fd7c2592c6d2f96cd53d79?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAK-1.png",
                "32x32": "https://secure.gravatar.com/avatar/153fbbf986fd7c2592c6d2f96cd53d79?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAK-1.png"
            },
            "displayName": "Aakriti Koul",
            "active": true,
            "timeZone": "America/Chicago",
            "locale": "en_US"
        },
        {
            "self": "https://api.atlassian.com/ex/jira/cccbe7e4-ab84-425a-9e09-1af4c6f0674e/rest/api/3/user?accountId=5dbad6518704ba0dab242d7e",
            "accountId": "5dbad6518704ba0dab242d7e",
            "accountType": "atlassian",
            "emailAddress": "abhishek.bansal@quovantis.com",
            "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/3fb2d54bacdd4af94000ddf1d9c755c4?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-2.png",
                "24x24": "https://secure.gravatar.com/avatar/3fb2d54bacdd4af94000ddf1d9c755c4?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-2.png",
                "16x16": "https://secure.gravatar.com/avatar/3fb2d54bacdd4af94000ddf1d9c755c4?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-2.png",
                "32x32": "https://secure.gravatar.com/avatar/3fb2d54bacdd4af94000ddf1d9c755c4?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-2.png"
            },
            "displayName": "Abhishek Bansal",
            "active": true,
            "timeZone": "America/Chicago",
            "locale": "en_US"
        }
    ];

    public static readonly getJiraUserResponse = {
        data: JiraTestConstants.getJiraUsersResult,
        message: "Success",
        statusCode: 200
    }
}

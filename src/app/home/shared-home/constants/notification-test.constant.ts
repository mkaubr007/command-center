import { NotificationConstants } from '../../../core/constants/notification.constant';

export class NotificationTestConstants {
    public static readonly NOTIFICATION_DATA = {
        count: 1,
        result: {
            groupNotifications: [
                {
                    groupName: NotificationConstants.NOTIFICATION_GROUP_NAME.TODAY,
                    notifications: [
                        {
                            _id: '5fcb293fae35e467f412c27f',
                            date: new Date('2020-12-05T06:31:27.010Z'),
                            errorType: 'information',
                            client: 'Emblem',
                            environment: 'Development 2',
                            serviceName: 'Emblem File Submission Dev',
                            message: '\n        <div>\n            Vikash Gaurav assigned error -\n            <span class=\'specific-txt\'> \'information\' </span>\n            for client Emblem\n            on environment \'Development 2\'\n            for the service \'Emblem File Submission Dev\' to you.\n            Click the error type to view it.\n        </div>\n            ',
                            source: 'MANUAL-ERROR-ASSIGNEE',
                            user: [
                                {
                                    id: '5e9e9022abfc01673460a39c',
                                    isRead: false
                                }
                            ],
                            assignedBy: {
                                id: '5e9e9022abfc01673460a39c',
                                name: 'Vikash Gaurav',
                                profilePic: 'https://cc-users-pic.s3.amazonaws.com/OamamVLVLVsL9ajAVURZ7Qh2.jpg'
                            }
                        }
                    ]
                }
            ],
            unreadCount: 1
        }
    };
}

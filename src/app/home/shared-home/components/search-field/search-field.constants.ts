export class SearchFieldConstants {
    public static readonly KEYPRESS_EVENT = {
        shiftKey: false,
        key: ' '
    };

    public static readonly PASTED_EVENT = {
        clipboardData : {
            getData: function(type) {
                return '  ';
            }
        }
    }
}
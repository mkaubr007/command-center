export class HomeDropdownConstants {
    public static readonly CLIENTS = 'Clients';
    public static readonly ENVIRONMENTS = 'Environments';
    public static readonly SERVICES = 'Services';
    public static readonly DEFAULT_SELECTED_CLIENTS = [{ _id: '1', name: 'All clients' }];
    public static readonly DEFAULT_ENVIRONMENTS = [
        { count: 1, name: 'Prioritized environments'},
        { count: 1, name: 'All environments'}
    ];
    public static readonly DEFAULT_SELECTED_ENVIRONMENTS = [HomeDropdownConstants.DEFAULT_ENVIRONMENTS[0]];
    public static readonly DEFAULT_SELECTED_SERVICES = [{ count: 1, name: 'All services'}];
    public static readonly ALL_ENVIRONMENTS = [{ count: 1, name: 'All environments'}];
    public static readonly CSRID = '1';
    public static readonly DISTINCT_CLIENT_IDS = ['1','2'];
    public static readonly DISTINCT_CLIENTS = [
        {
            _id: '1',
            name: 'client1'
        },
        {
            _id: '2',
            name: 'client2'
        }];
    public static readonly DISTINCT_ENVIRONMENTS = [
        {
            name: 'environment1',
            count: 1
        },
        {
            name: 'environment2',
            count: 1
        }
    ];
    public static readonly DISTINCT_SERVICES = [
        {
            name: 'service1',
            count: 1
        },
        {
            name: 'service2',
            count: 1
        }
    ];
    public static readonly DASHBOARD_FILTERS = {
        clientNames: HomeDropdownConstants.DISTINCT_CLIENTS.map(client => client.name),
        clients: HomeDropdownConstants.DISTINCT_CLIENT_IDS,
        environments: HomeDropdownConstants.DISTINCT_ENVIRONMENTS.map(env => env.name),
        services: HomeDropdownConstants.DISTINCT_SERVICES.map(service => service.name)
    };

    public static readonly DEACTIVATED_CLIENT = '{"clients":"1","environments":["environment1"],"services":["service1"]}';
    public static readonly ACTIVATED_CLIENT = '{"clients":"","environments":["environment2"],"services":["service2"]}';
    public static readonly DISTINCT_FILTERED_CLIENTS = [
        {
            _id: '2',
            name: 'client2'
        }
    ];
    public static readonly DISTINCT_FILTERED_ENVIRONMENTS = [{ name: 'environment2', count: 1 }];
    public static readonly DISTINCT_FILTERED_SERVICES = [{ name: 'service2', count: 1 }];
}
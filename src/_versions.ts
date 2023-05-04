export interface TsAppVersion {
    version: string;
    name: string;
    description?: string;
    versionLong?: string;
    versionDate: string;
    gitCommitHash?: string;
    gitCommitDate?: string;
    gitTag?: string;
};
export const versions: TsAppVersion = {
    version: '1.0.0',
    name: 'command-center',
    versionDate: '2022-02-23T04:47:57.919Z',
};
export default versions;

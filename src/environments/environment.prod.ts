import { versions } from '../_versions';

const frontendBasedUrl = 'https://commandcentertest.pareo.io';
const backendBasedUrl = 'https://ccapitest.pareo.io';

export const environment = {
  production: true,
  frontendBasedUrl,
  backendBasedUrl,
  port: '',
  appVersion: versions.version,
};

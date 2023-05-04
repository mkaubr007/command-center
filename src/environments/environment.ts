import versions from '../_versions';

const frontendBasedUrl = 'http://localhost:4200';
const backendBasedUrl = 'http://localhost:80';

export const environment = {
  production: false,
  frontendBasedUrl,
  backendBasedUrl,
  port: '',
  appVersion: versions.version,
};

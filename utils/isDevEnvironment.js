// Dev environment here means the app is being served from localhost or the
// tpos.magnitgo.uz domain - the environments that point at the tapi-erp
// (test/zarpos) backend rather than the production api-erp backend.
export function isDevEnvironment() {
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('tpos.magnitgo.uz')
}

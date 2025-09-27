// Fix for Payload/Luxon trying to access Intl.supportedTimezones
// In Node.js 20+, the correct API is Intl.supportedValuesOf("timeZone")

if (typeof (Intl as any).supportedTimezones === 'undefined' && typeof Intl.supportedValuesOf === 'function') {
  ;(Intl as any).supportedTimezones = () => Intl.supportedValuesOf('timeZone')
}

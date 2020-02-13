/**
 * The Moment is simply HTML code dispalyed in a WebView or iframe. The moment configuration data is 
 * sent to the Moment javascipt at runtime via the window.postMessage() API.
 * 
 * When your moment runs in production, the `custom` object is set by the Event organizer through 
 * the configuration page. The other data is automalically filled in by the wrapper.
 * 
 * The object you find below mocks the data that will be injected by the Moment wrapper 
 * (either join.stagecast.se or StagecastApp).
 * 
 * To develop and test, you must define this object by hand. We will soon create a tool
 * to create this object automatically.
 * 
 */
var momentData = {
  // the moment environment: 'staging' | 'production' | 'development'
  environment: 'production',
  // the user that interacts with the moment
  userId: '<YOUR_USER_EMAIL>',
  // the token of the user
  token: '<YOUR_TOKEN>',
  momentClassData: {
    // the language of the moment (selected among the ones the moment supports). 
    // To define the supported languages have a loook at ../../stagecast/config
    language: 'en',
    // Flag to tell the MDK to show/hide sponsors
    showSponsor: true,
    sponsor: {
      // the sponsor images as Content IDs or links
      logos: [],
      // The credit text that will be displayed on top of the logos.
      credit: 'The moment is provided by:'
    },
    // The moment class custom object: 
    // The developer defines what variables that can be configured and how to configure them.
    // the values are set by the event organizer via configuration page.
    custom: {
      // the Color Moment color fade pattern (soft = cross fade, hard = no fade)
      pattern: 'soft',
      // how long a color is displayed for
      interval: 1000,
      // the colors that will di displayed.
      colors: ['#005aff', "red", '#ffe200']
    }
  },
  // the moment creation time (you can have a fixed timestamp, or a dynamic one)
  created: new Date().getTime(),
  // you can get these ids by calling the sanboxed api. Check the README.md for more.
  momentClassId: '3A3C4E61-AE3A-474E-B48F-23528A4F3B95',
  momentId: '0D86F6DF-1B16-484C-B22C-95C15B36F31C',
  eventId: '7CE91D1C-9BCF-4016-B87E-AF21D4E80CB9',
  // flag to tell the MDK to deactivate the window.console (used in production)
  disableLogs: false,
  
  // LEGACY VARIABLES BLOCK: 
  // These used to be important variables in older versions on Stagecast, 
  // right now they are not used anymore and will be replaced/removed in future releases.
  
  // user coordinates injected from the wrapper (these are often times not set, so don't count on them)
  coordinates: ['0', '0'],
  // tell if the user is a guest or a normally registered user. Some time ago, we had two different 
  // users: registed and guest. Registered users were regular StagecastApp users with name, profile pic, age, gender etc... 
  // Guest users were non registered users with some limited privileges: the could use some moments, but they didn't have information like 
  // prifile pictures, name, gender etc.
  isGuest: false,
  // flags to tell if the Moment is currently live (the names are different for backward 
  // compatibility issues). You can implement custom logic when the moment gets deactivated.
  isActive: true,
  isMomentActive: true
}
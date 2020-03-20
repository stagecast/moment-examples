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
    userId: 'm.schrom@52five.com',
    // the token of the user
    token: 'JDJhJDEyJDZxR2hFenZkbk1RZmRTSTUxdTFsbC45V2V5eGhaWWl0SXlPS2FrNEZ3M09LLmxhcmQ5ZmtX',
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
            backgroundImage: undefined, // The default background color is set in the style section
            introText: 'Complete all quests and win a prize!',
            prizeImage: './img/default-prize.svg',
            prizeButtonText: 'Prize',
            prizeDescriptionHeadline: 'You can win a prize',
            prizeDescriptionText: 'This is a description about the prize that you can win. This is a description about the prize that you can win. This is a description about the prize that you can win. This is a description about the prize that you can win',
            quests: [
                {
                    name: 'Quest 1',
                    question: 'Visit London and go to the London Eye. How many cars does it have?',
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/London-Eye-2009.JPG/1024px-London-Eye-2009.JPG',
                    imageLink: 'https://en.wikipedia.org/wiki/London_Eye',
                    answers: "32, thirtytwo, thirty two, zweiunddreißig, trettiotvå",
                },
                {
                    name: 'Quest 2',
                    question: 'Visit Vienna and go to the Wiener Riesenrad. How many gondolas does it have?',
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Wien_Riesenrad.jpg/1024px-Wien_Riesenrad.jpg',
                    imageLink: 'https://de.wikipedia.org/wiki/Wiener_Riesenrad',
                    answers: "15, fifteen, fünfzehn, femton"
                }
            ],
            winText: 'Congratulations! You have won a prize.',
            claimButtonText: 'Claim Prize',
            claimButtonLink: 'https://www.stagecast.io',
            resultBackgroundImage: undefined,
            resultText: 'Participate in the Treasure Hunt now and win a prize!',
        }
    },
    // the moment creation time (you can have a fixed timestamp, or a dynamic one)
    created: new Date().getTime(),
    // you can get these ids by calling the sanboxed api. Check the README.md for more.
    momentClassId: 'F2168475-B176-46B1-B2DD-DB7FFCEE2AF5',
    momentId: 'E2C5B26E-0042-44A6-8751-A22A175FF7E0',
    eventId: 'FF4FA36A-5B52-44D7-92C1-204457BD1E87',
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
};
// instantiate the MDK
const SDK = new Stagecast();

// example custom data (used for offline testing)
const defaultData = {
  pattern: 'soft', // soft | hard
  colors: ['#005aff', '#ffe200'], // hex
  interval: 2000 // ms
}

function setupMoment(data, error) {
  if (error) {
    return;
  }
  // add ADV banner
  fillBanner();
  // get config data from returned object
  const settings = checkSettings(data.custom);
  const box = document.getElementById('colorBox');
  let i = 0;
  box.style.transition = getTransition(settings.pattern, settings.interval);
  box.style.backgroundColor = settings.colors[i];
  return setInterval(() => {
    i += 1;
    box.style.backgroundColor = settings.colors[i % settings.colors.length];
  }, settings.interval);

}

function checkSettings(settings) {
  let s = Object.assign({}, settings);
  if (!s.colors || !s.colors.length) {
    s.colors = defaultData.colors;
  }
  if (!s.interval || s.interval > 50000) {
    s.interval = defaultData.interval;
  }
  if (s.pattern !== 'soft' && s.pattern !== 'hard') {
    s.pattern = defaultData.pattern;
  }
  return s;
}

function fillBanner() {
  try {
    // use the MDK banner injector to add sponsor logos
    let res = SDK.bannerInjector.injectAdvertisementBanner(['#banner']);
    if (!res) {
      document.querySelector('#banner').remove();
    }
  } catch (error) {}
}

function getTransition(selectedPattern, interval) {
  if (selectedPattern === 'soft') {
    return `background ${interval}ms ease-in-out 0s`;
  } else {
    return 'none';
  }
}

function initialize() {
  // get the moment class
  SDK.connection.getMomentClass()
    .then(function (data) {
      setupMoment(data, null);
    })
    .catch(function (err) {
      setupMoment(null, err);
    })
}

// The moment starts when the window receives the configuration
SDK.onConfigReceived(function () { initialize(); });
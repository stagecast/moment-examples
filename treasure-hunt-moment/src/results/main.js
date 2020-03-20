if (window.Stagecast) {

  /**
   * Create and initialize
   */
  var SDK = new Stagecast();
  var customData;
  var defaultData = {
    resultText: 'Participate in the Treasure Hunt now and win a prize!'
  };
  SDK.onConfigReceived(handleOnConfigReceived);

  /**
   * Handle the received configuration
   */
  function handleOnConfigReceived() {
    // Get the Moment Class
    SDK.connection.getMomentClass()
      .then((data) => {
        handleCustomData(data.custom);
      })
      .catch((err) => {
        console.error(err);
      });

    handleGlobalState();
    window.setInterval(handleGlobalState, 5000);
  }

  /**
   * Handle the global state
   */
  function handleGlobalState() {
    SDK.connection.getMomentGlobalState()
      .then((data) => {
        var total = 0;
        var userStates = Object.values(data);
        for (var i = 0; i < userStates.length; i++) {
          total += userStates[i].length;
        }
        console.log(data, total);
        document.getElementById("quests-count").innerHTML = total;
      })
      .catch((err) => {
        console.error(err);
      })
  }

  /**
   * Handle the custom data
   */
  function handleCustomData(data) {
    customData = Object.assign({}, data);
    if (!customData.resultText || !customData.resultText.length) customData.resultText = defaultData.resultText;

    displayCustomData();
  }

  /**
   * Display the custom data
   */
  function displayCustomData() {
    if (customData.resultText && customData.resultText.length > 0) {
      document.getElementById("result-text").innerHTML = sanitize(customData.resultText);
    }
    if (customData.resultBackgroundImage && customData.resultBackgroundImage.length > 0) {
       const url = SDK.connection.getContentCdnLocation(customData.resultBackgroundImage[0]);
       document.getElementsByTagName("html")[0].style.backgroundImage = `url(${url})`;
    }
  }

  function sanitize(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
      "`": '&grave;',
      "(": '&#40;',
      ")": '&#41;',
      "{": "&#123;"
    };
    const reg = /[&<>"'/]/ig;
    return String(text).replace(reg, (match) => (map[match]));
  }
}
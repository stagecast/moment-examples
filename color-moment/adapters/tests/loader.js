function iframeLoaded() {
  document.getElementById("frame").contentWindow.postMessage({
    "messageSource": "STAGECAST_SDK",
    "config": momentData
  }, '*');
}
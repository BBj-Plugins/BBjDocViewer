websocket = new WebSocket(getParameterByName("_socket"));
websocket.onopen = function (evt) { onOpen(evt); };
websocket.onclose = function (evt) { onClose(evt); };
websocket.onmessage = function (evt) { onMessage(evt); };
websocket.onerror = function (evt) { onError(evt); };

function onOpen(evt) {
  console.log("Socket connected:", evt);
}

function onClose(evt) {
  console.log("Socket disconnected:", evt);
}

function onMessage(evt) {
  let data = JSON.parse(evt.data);

  if (data['type'] in window) {
    window[data["type"]](data.detail);
  } else {
    console.warn('Unable to handle message : ', evt);
  }
}

function onError(evt) {
  console.log("Socket error: ", evt);
}

function send(message) {
  if (websocket.readyState == 1) {
    websocket.send(JSON.stringify(message));
  }
}

function dv_open(detail) {

  send({ type: 'opening', detail: {} });
  window.PDFViewerApplication.open(detail.path).then(function () {
    send({ type: 'opened', detail: {} });
  }).catch(function (e) {
    send({ type: 'openFailed', detail: {} });
  });
}

function dv_zoomIn(detail) {
  window.PDFViewerApplication.zoomIn();
}

function dv_zoomOut(detail) {
  window.PDFViewerApplication.zoomOut();
}

function dv_setPage(detail) {
  window.PDFViewerApplication.page = Number(detail.page);
}

function dv_nextPage() {
  window.PDFViewerApplication.toolbar.items.next.click();
}

function dv_prevPage() {
  window.PDFViewerApplication.toolbar.items.previous.click();
}

function dv_showToolbar() {
  var toolbarContainer = document.querySelector("#toolbarContainer");
  var viewerContainer = document.querySelector("#viewerContainer");
  toolbarContainer.style.display = 'block';
  viewerContainer.style.top = '32px';
  viewerContainer.style.paddingTop = '0';
}

function dv_hideToolbar() {
  var toolbarContainer = document.querySelector("#toolbarContainer");
  var viewerContainer = document.querySelector("#viewerContainer");
  toolbarContainer.style.display = 'none';
  viewerContainer.style.top = '0';
  viewerContainer.style.paddingTop = '10px';
}

function dv_toggleSidebar() {
  document.querySelector("#sidebarToggle").click();
}

function dv_activateHandtool() {
  window.PDFViewerApplication.pdfCursorTools.handTool.activate();
}

function dv_deativateHandtool() {
  window.PDFViewerApplication.pdfCursorTools.handTool.deactivate();
}

document.addEventListener('DOMContentLoaded', function () {
  window.PDFViewerApplication.watch('initialized', function () {
    console.log('viewer initialized successfully');
    window.PDFViewerApplication.loadingBar.watch('visible', function (id, oldval, newval) {
      if (newval === false) {
        send({
          type: 'initialized',
          detail: {}
        });
      }
    });
  });
}, true);






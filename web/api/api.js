function getSocket() {

  if (getSocket.server && getSocket.server.readyState < 2) {
    console.log("reusing the socket connection [state = " + getSocket.server.readyState + "]: " + getSocket.server.url);
    return Promise.resolve(getSocket.server);
  }

  var url = getParameterByName("_socket");
  return new Promise(function (resolve, reject) {

    getSocket.server = new WebSocket(url);

    getSocket.server.onopen = function () {
      console.log("opened new socket connection [state = " + getSocket.server.readyState + "]: " + getSocket.server.url);
      resolve(getSocket.server);
    };

    getSocket.server.onerror = function (err) {
      console.error("socket connection error : ", err);
      reject(err);
    };

    getSocket.server.onmessage = function (e) {

      let data = JSON.parse(e.data);

      console.log("getting message from the server : ", data);

      if (data['type'] in window) {
        window[data["type"]](data.detail);
      } else {
        console.warn('Unable to handle message : ', e);
      }
    };
  });
}

function emit(message) {

  return getSocket().then(function (server) {
    server.send(JSON.stringify(message));
    console.log("sent message to the server : ", message);
    return Promise.resolve();
  });
}

function dv_open(detail) {

  return emit({ type: 'opening', detail: {} }).then(function () {
    return window.PDFViewerApplication.open(detail.path).then(function () {
      return emit({ type: 'opened', detail: {} });
    }).catch(function (e) {
      return emit({ type: 'openFailed', detail: {} });
    });
  });
}

function dv_zoomIn() {
  window.PDFViewerApplication.zoomIn();
}

function dv_zoomOut() {
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

  var isBui = getParameterByName("bui");
  if("true" !== isBui) {
    document.querySelectorAll(".presentationMode").forEach(function(item){
      item.classList.add('hidden');
    });
  }

  window.PDFViewerApplication.watch('initialized', function () {
    emit({
      type: 'initialized',
      detail: {}
    });

    // window.PDFViewerApplication.loadingBar.watch('visible', function (id, oldval, newval) {
    //   if (newval === false) {
    //     emit({
    //       type: 'initialized',
    //       detail: {}
    //     });
    //   }
    // });
  });
}, true);






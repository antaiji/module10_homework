const wsUri = "wss://echo-ws-service.herokuapp.com";

const btnSubmit = document.querySelector(".chat__btn-submit");
const btnGeo = document.querySelector(".chat__btn-geo");
const chatField = document.querySelector(".chat__field");
// write messages to screen
const writeToScreen = (message) => {
  let msgBlock;

  if (message.source === "client") {
    msgBlock = `<span class="chat__item chat__req"><strong>Client:</strong> ${message.data}</span>`;
  }

  if (message.source === "server") {
    msgBlock = `<span class="chat__item chat__res"><strong>Server:</strong> ${message.data}</span>`;
  }

  if (message.source === "geo") {
    msgBlock = `<span class="chat__item chat__geo"><strong>Location:</strong> ${message.data}</span>`;
  }

  if (message.source === "error") {
    msgBlock = `<span class="chat__item chat__err"><strong>Error:</strong> ${message.data}</span>`;
  }

  chatField.innerHTML += msgBlock;
};
// connect to websocket server
const serverConnector = (url) => {
  websocket = new WebSocket(url);
  websocket.onmessage = function (evt) {
    const msgData = { source: "server", data: evt.data };
    writeToScreen(msgData);
  };
  websocket.onerror = function (evt) {
    writeToScreen({ source: "error", data: evt.data });
  };
};

// success function for geolocation
const success = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const msgData = {
    source: "geo",
    data: `<a target="_blank" href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}">Geolocation map link</a>`,
  };

  writeToScreen(msgData);
};
// error function for geolocation
const error = () => {
  const msgData = {
    source: "error",
    data: "It's impossible to get your location",
  };

  writeToScreen(msgData);
};
// submit message event
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const message = document.querySelector(".chat__input").value;
  const msgData = { source: "client", data: message };
  if (message && message.trim().length > 0) {
    writeToScreen(msgData);
    websocket.send(message);
  }

  document.querySelector(".chat__input").value = null;
});
// get location event
btnGeo.addEventListener("click", () => {
  if (!navigator.geolocation) {
    const msgData = {
      source: "error",
      data: "Your browser does not support geolocation",
    };
    writeToScreen(msgData);
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});
// initial connection to websocket server
document.addEventListener("DOMContentLoaded", function () {
  serverConnector(wsUri);
});

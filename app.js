const APP = {
  SW: null,
  mylist: [],
  otherlist: [],
  ul: null,
  myid: null,
  myIdTag: null,
  init() {
    //called after DOMContentLoaded
    //register our service worker
    APP.registerSW();
    document
      .getElementById("colorForm")
      .addEventListener("submit", APP.saveColor);

    document.querySelector("h2").addEventListener("click", (ev) => {
      //send a message to the service worker
      //have it bounce back to all pages sharing that sw
    });
  },
  registerSW() {
    if ("serviceWorker" in navigator) {
      // Register a service worker hosted at the root of the site
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          APP.SW =
            registration.installing ||
            registration.waiting ||
            registration.active;
        },
        (error) => {
          console.log("Service worker registration failed:", error);
        }
      );
      //listen for the latest sw
      navigator.serviceWorker.addEventListener("controllerchange", async () => {
        APP.SW = navigator.serviceWorker.controller;
      });
      //listen for messages from the service worker
      navigator.serviceWorker.addEventListener("message", APP.onMessage);
    } else {
      console.log("Service workers are not supported.");
    }
  },
  saveColor(ev) {
    ev.preventDefault();

    let name = document.getElementById("name");
    let color = document.getElementById("color");
    let ul = document.getElementById("mylist");
    let strName = name.value.trim();
    name.value = "";
    // let strColor = color.value.trim();
    if (strName) {
      let person = {
        isMatser: false,
        message: strName,
      };
      console.log("Save", person);
      //send the data to the service worker
      debugger;
      //, otherAction: 'hello'
      APP.sendMessage({ addPerson: person });
      APP.mylist = [person];
      // debugger;

      setTimeout(() => {
        APP.mylist.forEach((item) => {
          // console.log("id", APP.m);
          // if (person.message !== item.message) {
          ul.innerHTML += `<tr><td>${APP.myid}</td><td>${item.message}</td> </tr>`;
          // }
        });
      }, 10);
    }
  },
  sendMessage(msg) {
    //send some structured-cloneable data from the webpage to the sw
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
      console.log(navigator.serviceWorker);
    }
  },
  onMessage({ data }) {
    let ul = document.getElementById("otherlist");
    APP.myIdTag = document.getElementById("myid");
    //got a message from the service worker
    console.log("Web page receiving", data);
    if (typeof data == "string") {
      APP.myIdTag.innerHTML = data;
      APP.myid = data;
    } else {
      APP.otherlist = [data];
      console.log("Web page receiving list", APP.otherlist);

      APP.otherlist.forEach((item) => {
        // if (data.message !== item.message) {
        ul.innerHTML += `<tr><td>${item.clientId}</td><td>${item.message}</td> </tr>`;
        // }
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);

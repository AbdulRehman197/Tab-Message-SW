const APP = {
  bc: null,
  mylist: [],
  otherlist: [],
  ul: null,
  myid: uuidv4(),

  myIdTag: null,
  init() {
    //called after DOMContentLoaded
    //register our service worker
    // APP.registerSW();
    APP.myIdTag = document.getElementById("myid");
    APP.myIdTag.innerHTML = APP.myid;
    document
      .getElementById("colorForm")
      .addEventListener("submit", APP.saveColor);
    APP.bc = new BroadcastChannel("todo");
    // document.querySelector("h2").addEventListener("click", (ev) => {
    //   //send a message to the service worker
    //   //have it bounce back to all pages sharing that sw
    // });
    APP.bc.addEventListener("message", APP.onMessage);
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
        id: APP.myid,
        isMatser: false,
        message: strName,
      };
      //send the data to the service worker
      debugger;
      //, otherAction: 'hello'
      APP.sendMessage({ addPerson: person });
      APP.mylist = [person];
      console.log("Save", APP.mylist);

      // debugger;
      let newlist = APP.mylist.filter((item) => {
        return item.message !== person.message ? null : person.message;
      });

      APP.mylist.forEach((item) => {
        // console.log("id", APP.m);
        // if (person.message !== item.message) {
        ul.innerHTML += `<tr><td>${item.id}</td><td>${item.message}</td> </tr>`;
        // }
      });
    }
  },
  sendMessage(msg) {
    APP.bc.postMessage(msg);
    //send some structured-cloneable data from the webpage to the sw
    // if (navigator.serviceWorker.controller) {
    //   navigator.serviceWorker.controller.postMessage(msg);
    //   console.log(navigator.serviceWorker);
    // }
  },

  onMessage({ data }) {
    let ul = document.getElementById("otherlist");
    //got a message from the service worker

    APP.otherlist = [data.addPerson];
    console.log("Web page receiving", data);
    console.log("Web page receiving list", APP.otherlist);
    let newlist = APP.otherlist.filter((item) => {
      return item.message !== data.addPerson.message
        ? null
        : data.addPerson.message;
    });
    APP.otherlist.forEach((item) => {
      // if (data.message !== item.message) {
      ul.innerHTML += `<tr><td>${item.id}</td><td>${item.message}</td> </tr>`;
      // }
    });
  },
};

document.addEventListener("DOMContentLoaded", APP.init);

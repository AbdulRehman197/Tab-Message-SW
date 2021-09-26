const APP = {
  SW: null,
  mylist: [],
  otherlist: [],
  ul: null,
  myid: null,
  myIdTag: null,
  isFinished: false,
  init() {
    //called after DOMContentLoaded
    //register our service worker
    APP.registerSW();
    // document
    //   .getElementById("colorForm")
    //   .addEventListener("submit", APP.saveColor);
    document.getElementById("tab1").addEventListener("click", APP.saveColor);
    document.getElementById("tab2").addEventListener("click", APP.saveColor);
    document.getElementById("tab3").addEventListener("click", APP.saveColor);
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
    APP.sendMessage({ tab: ev.target.id });
  },
  sendMessage(msg) {
    //send some structured-cloneable data from the webpage to the sw
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
      console.log(navigator.serviceWorker);
    }
  },
  onMessage({ data }) {
    APP.myIdTag = document.getElementById("myid");
    console.log("data", data);
    APP.myIdTag.innerHTML = data.clientId;
    APP.myid = data.clientId;
    if (data.tab == "tab1") {
      console.log("tab1 working", data.tab);
      APP.tab1SaveData();
    }
    if (data.tab == "tab2") {
      console.log("tab2 working", data.tab);

      APP.tab2SaveData();
    }
    if (data.tab == "tab3") {
      console.log("tab3 working", data.tab);

      APP.tab3SaveData();
    }
  },

  async tab1SaveData() {
    APP.isFinished = false;
    // ev.preventDefault();
    let status = document.getElementById("status");

    let counter = document.getElementById("counter").value;
    let ShowValue = document.getElementById("ShowValue");
    let name = `DB1_Blob`;
    let db = await idb.openDB("db1", 1, {
      upgrade(db) {
        db.createObjectStore("store");
      },
    });

    if (!this.isFinished) {
      status.innerHTML = "Proccesing";
    }
    const tx = await db.transaction("store", "readwrite");
    const store = await tx.objectStore("store");
    for (let index = 0; index < counter; index++) {
      ShowValue.innerHTML = index + 1;
      await store.put(
        name + (index + 1) + "_" + APP.myid,
        sha256(name + (index + 1) + APP.myid)
      );
      APP.isFinished = true;
    }
    if (this.isFinished) {
      status.innerHTML = "Finish";
    }
  },
  async tab2SaveData() {
    APP.isFinished = false;
    // ev.preventDefault();
    let status = document.getElementById("status");

    let counter = document.getElementById("counter").value;
    let ShowValue = document.getElementById("ShowValue");
    let name = `DB1_Blob`;
    let db = await idb.openDB("db1", 1, {
      upgrade(db) {
        db.createObjectStore("store");
      },
    });

    if (!this.isFinished) {
      status.innerHTML = "Proccesing";
    }
    const tx = await db.transaction("store", "readwrite");
    const store = await tx.objectStore("store");
    for (let index = 0; index < counter; index++) {
      ShowValue.innerHTML = index + 1;
      await store.put(
        name + (index + 1) + "_" + APP.myid,
        sha256(name + (index + 1) + APP.myid)
      );
      APP.isFinished = true;
    }
    if (this.isFinished) {
      status.innerHTML = "Finish";
    }
  },
  async tab3SaveData() {
    APP.isFinished = false;
    // ev.preventDefault();
    let status = document.getElementById("status");

    let counter = document.getElementById("counter").value;
    let ShowValue = document.getElementById("ShowValue");
    let name = `DB1_Blob`;
    let db = await idb.openDB("db1", 1, {
      upgrade(db) {
        db.createObjectStore("store");
      },
    });

    if (!this.isFinished) {
      status.innerHTML = "Proccesing";
    }
    const tx = await db.transaction("store", "readwrite");
    const store = await tx.objectStore("store");
    for (let index = 0; index < counter; index++) {
      ShowValue.innerHTML = index + 1;
      await store.put(
        name + (index + 1) + "_" + APP.myid,
        sha256(name + (index + 1) + APP.myid)
      );
      APP.isFinished = true;
    }
    if (this.isFinished) {
      status.innerHTML = "Finish";
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);

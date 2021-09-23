const APP = {
  db: null,
  init() {
    //called after DOMContentLoaded
    //register our service worker
    APP.initDB();
    document
      .getElementById("colorForm")
      .addEventListener("submit", APP.saveColor);
  },

  saveColor(ev) {
    ev.preventDefault();
  },

  initDB() {
    const request = indexedDB.open("library", 1);

    request.onupgradeneeded = function () {
      // The database did not previously exist, so create object stores and indexes.
      APP.db = request.result;
      APP.db.createObjectStore("books", { keyPath: "isbn" });
    };
    request.onsuccess = function () {
      APP.db = request.result;
      const tx = APP.db.transaction("books", "readwrite");
      const store = tx.objectStore("books");

      store.put({ title: "Quarry Memories", author: "Fred", isbn: 123456 });
      store.put({ title: "Water Buffaloes", author: "Fred", isbn: 234567 });
      store.put({ title: "Bedrock Nights", author: "Barney", isbn: 345678 });

      tx.oncomplete = function () {
        // All requests have succeeded and the transaction has committed.
        console.log("transaction complete");
      };
      let newtx = APP.db.transaction("books", "readonly");
      let newstore = newtx.objectStore("books");
      let result = newstore.get(123456);
      newtx.oncomplete = function () {
        // All requests have succeeded and the transaction has committed.
        console.log("transaction2 complete");
        console.log("result", result.result);
      };

      const txw2 = APP.db.transaction("books", "readwrite");
      const store2 = tx.objectStore("books");
      store2.put({ title: "Quarry Memories", author: "Fred", isbn: 1000000 });
      txw2.oncomplete = function () {
        // All requests have succeeded and the transaction has committed.
        console.log("transactionwrite2 complete");
        // console.log("result", result.result);
      };
      
    };
  },
};

document.addEventListener("DOMContentLoaded", APP.init);

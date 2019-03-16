const localStorageManager = {
  // fetches remote data and enters it into
  // localStorage along with date updated
  async _fetchData(name, url) {
    // console.log('fetching', name, url);
    await (await fetch(url))
      .json()
      .then(data => {
        localStorage.setItem(name, JSON.stringify(data));
        localStorage.setItem(name + "_registry", new Date());
        return data;
      })
      .catch(reason => console.warn("error", reason.message));
  },

  async getItem(name, address) {
    // console.log('asking from localStorageManager', name, address);
    // do we have localStorage available
    if (typeof Storage !== "undefined") {
      // if we don't have an entry for the object
      // or a registry entry for the object,
      // go get it, set it, and return it.
      if (
        localStorage.getItem(name) === null ||
        localStorage.getItem(name + "_registry") === null
      ) {
        // console.log('is not in localStorageManager', name, address);
        await this._fetchData(name, address);

        // entry exists in localStorage, validate it's age
        // and return if less than a week old
      } else {
        const registryDate = localStorage.getItem(name + "_registry");

        // 604800000 is about a week?
        // if the registry is out of date go get the object
        if (new Date() - new Date(registryDate) > 604800000) {
          // console.log('localStorage is stale get resource again');

          await this._fetchData(name, address);
        }

        // now registry fine and item exists
        // console.log('local storage fine');
        return JSON.parse(localStorage.getItem(name));
      }

      // no localStorage get the remote resource and return it
    } else {
      // console.log('localStorage not available returning remote resource');
      fetch(address)
        .then(resp => resp.json())
        .then(function(data) {
          return data;
        });
    }
  },

  getRecent() {
    if (localStorage.getItem("recent") !== null) {
      return JSON.parse(localStorage.getItem("recent"));
    }
  },

  pushStopToRecent(stopInfo) {
    let recent = [];
    // does recent list exist
    if (localStorage.getItem("recent") === null) {
      recent.push(stopInfo);
      localStorage.setItem("recent", JSON.stringify(recent));
      return;
    }

    recent = JSON.parse(localStorage.getItem("recent"));
    recent.forEach(i => {
      if (i.id === stopInfo.id) {
        recent.splice(recent.indexOf(i), 1);
        return false;
      }
    });
    recent.unshift(stopInfo);
    recent.length <= 10 || recent.shift();
    localStorage.setItem("recent", JSON.stringify(recent));
  }
};

export default localStorageManager;

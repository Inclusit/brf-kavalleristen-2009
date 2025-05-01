type LocalStorageKey = "@library/token";

class LocalStorageKit {
  //Set data to local storage with key as the identifier for the data to be stored in local storage
  static set(key: LocalStorageKey, data: any) {
    let jsonData = typeof data === "string" ? data : JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  }

  //Get data from local storage using the key as the identifier for the data stored in local storage
  static get(key: LocalStorageKey) {
    const jsonData = localStorage.getItem(key);
    try {
      if (!jsonData) return null;

      return JSON.parse(jsonData);
      
    } catch {
      return jsonData; // <-- JWT fallback
    }
  }

  //Remove data from local storage using the key as the identifier for the data stored in local storage
  static remove(key: LocalStorageKey) {
    localStorage.removeItem(key);
  }
}

export default LocalStorageKit;

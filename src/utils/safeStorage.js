// Safe localStorage wrapper — falls back to in-memory storage when blocked
const inMemory = new Map();
let usable = true;

try {
  const testKey = "__storage_test__";
  window.localStorage.setItem(testKey, "ok");
  window.localStorage.removeItem(testKey);
  usable = true;
} catch (e) {
  usable = false;
}

const safeStorage = {
  getItem(key) {
    try {
      if (usable) return window.localStorage.getItem(key);
    } catch (e) {
      usable = false;
    }
    return inMemory.has(key) ? inMemory.get(key) : null;
  },
  setItem(key, value) {
    try {
      if (usable) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      usable = false;
    }
    inMemory.set(key, value);
  },
  removeItem(key) {
    try {
      if (usable) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      usable = false;
    }
    inMemory.delete(key);
  },
  clear() {
    try {
      if (usable) {
        window.localStorage.clear();
        return;
      }
    } catch (e) {
      usable = false;
    }
    inMemory.clear();
  },
};

export default safeStorage;

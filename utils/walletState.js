let userPublicKey = null;

export function setUserPublicKey(key) {
  userPublicKey = key;
}

export function getUserPublicKey() {
  return userPublicKey;
}

export function arrayBufferToBase64(arrayBuffer) {
  var byteArray = new Uint8Array(arrayBuffer);
  var byteString = '';
  for (var i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  var b64 = window.btoa(byteString);
  return b64;
}

function addNewLines(str) {
  var finalString = '';
  while (str.length > 0) {
    finalString += str.substring(0, 64) + '\n';
    str = str.substring(64);
  }
  return finalString;
}

function removeLines(str) {
  var lines = str.split('\n');
  lines.shift();
  lines.pop();
  var encodedString = '';
  for(var i=0; i < lines.length; i++) {
      encodedString += lines[i].trim();
  }
  return encodedString;
}

export function base64ToArrayBuffer(b64) {
  let temp = window.atob(b64);
  var len = temp.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++)        {
      bytes[i] = temp.charCodeAt(i);
  }
  return bytes;
}

export function toPem(key, type) {
  var b64 = addNewLines(arrayBufferToBase64(key));
  var pem = `-----BEGIN ${type} KEY-----\n` + b64 + `-----END ${type} KEY-----`;
  return pem;
}

function toArrayBuffer(key) {
  let noLines = removeLines(key);
  let byteArray = base64ToArrayBuffer(noLines);
  return byteArray;
}

/**
 * Returns a promise that returns the key pair
 * @param {*} modulusLength
 */
export function generateKey(modulusLength) {
  return window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: modulusLength, // can be 1024, 2048 or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' } // or SHA-512
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export function exportPrivateKey(key) {
  return window.crypto.subtle.exportKey('pkcs8', key);
}

export function exportPublicKey(key) {
  return window.crypto.subtle.exportKey('spki', key);
}

export async function importPrivateKey(key) {
  return crypto.subtle.importKey(
    "pkcs8",
    toArrayBuffer(key),
    {
      name: "RSA-OAEP",
      hash: {name: "SHA-256"}
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function importPublicKey(key) {
  return crypto.subtle.importKey(
    "spki",
    toArrayBuffer(key),
    {
      name: "RSA-OAEP",
      hash: {name: "SHA-256"}
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export function encrypt(text, key) {
  let enc = new TextEncoder();
  text = enc.encode(text);
  return window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    key,
    text
  );
}

export async function decrypt(text, key) {
  let temp = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    key,
    text
  );
  let dec = new TextDecoder();
  return dec.decode(temp);
}

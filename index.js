/* Implementation of PBKDF2
 * 
 * The algorithm is explained here: https://en.wikipedia.org/wiki/PBKDF2
 * This module only supports UNIX-like system because it uses /dev/urandom for 
 * salt generation. On other OS, you can use the timestamp as the seed. 
 */

"use strict";

const Hasher = require("./Hasher");

const ITERATION = 30000;
const ENCODING = "hex";
const HASH_METHOD = "sha512";
const KEY_LENGTH = 512;

function createHasher (args) {
  // This object is created ONLY when default constructor is needed,
  // therefore allowing the user to set whichever arguments they want
  const a = args || {
    iteration: ITERATION,
    encoding: ENCODING,
    method: HASH_METHOD,
    keylen: KEY_LENGTH
  };
  const i = a.iteration || ITERATION;
  const e = a.encoding || ENCODING;
  const m = a.method || HASH_METHOD;
  const k = a.keylen || KEY_LENGTH;
  return new Hasher(i, e, m, k);
}

exports.create = createHasher;


exports.createAsync = function (args) {
  // Function factory copy
  const hasher = createHasher(args);
  const hasherAsync = createHasher(args);

  hasherAsync.hash = function (pwd, urand=true) {
    return new Promise((fulfill, reject) => {
      hasher.hash(pwd, function (err, hashed) {
        if (err) reject(err);
        else fulfill(hashed);
      }, urand);
    });
  };

  hasherAsync.validate = function (new_, old, enc) {
    return new Promise((fulfill, reject) => {
      hasher.validate(new_, old, function (err, valid) {
        if (err) reject(err);
        else fulfill(valid);
      }, enc);
    });
  };

  return hasherAsync;
};
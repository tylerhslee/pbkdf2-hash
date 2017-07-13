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

exports.create = function (args) {
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

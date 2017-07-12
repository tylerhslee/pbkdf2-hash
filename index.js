/* Implementation of PBKDF2
 * 
 * The algorithm is explained here: https://en.wikipedia.org/wiki/PBKDF2
 * This module only supports UNIX-like system because it uses /dev/urandom for 
 * salt generation. On other OS, you can use the timestamp as the seed. 
 */

"use strict";
require("dotenv").config();

const Hasher = require("./Hasher");

exports.create = function (args) {
    // This object is created ONLY when default constructor is needed,
    // therefore allowing the user to set whichever arguments they want
    const a = args || {
        iteration: parseInt(process.env.ITERATION),
        encoding: process.env.ENCODING,
        method: process.env.HASH_METHOD,
        keylen: parseInt(process.env.KEY_LENGTH)
    };
    const i = a.iteration || parseInt(process.env.ITERATION);
    const e = a.encoding || process.env.ENCODING;
    const m = a.method || process.env.HASH_METHOD;
    const k = a.keylen || parseInt(process.env.KEY_LENGTH);
    return new Hasher(i, e, m, k);
}

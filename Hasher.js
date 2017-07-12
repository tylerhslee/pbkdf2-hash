"use strict";

const crypto = require("crypto");
const randomSource = require("randbytes").urandom.getInstance();
const timeSource = require("randbytes").timeRandom.getInstance();


const Hashed = {
    key: null,
    salt: null,
    iter: 0,

    create (key, salt, iter) {
        this.key = key;
        this.salt = salt;

        if (typeof iter !== "number") throw Error("Iteration must be a number")
        this.iter = iter;

        return this;
    },

    parse (pass, enc) {
        // String to Buffer
        const arr = pass.split(":");
        this.key = new Buffer(arr[2], enc);
        this.salt = new Buffer(arr[1], enc);
        this.iter = parseInt(arr[0]);
        return this;
    },

    decode (enc) {
        const decodedKey = this.key.toString(enc).toUpperCase();
        const decodedSalt = this.salt.toString(enc).toUpperCase();
        const iter = this.iter;
        return {
            key: decodedKey,
            salt: decodedSalt,
            iter: iter
        };
    },

    toString (enc) {
        const decoded = this.decode(enc);
        return `${decoded.iter}:${decoded.salt}:${decoded.key}`;
    }
};

function Hasher (iteration, encoding, hashMethod, keyLength) {
    // Type validation (dotenv gives iteration as string, so just to be careful)
    if (typeof iteration !== "number") throw Error("Iteration must be number");
    this.iter = iteration;
    
    this.hashMethod = hashMethod;

    if (typeof keyLength !== "number") throw Error("Key length must be number");
    this.keylen = keyLength;

    this.encoding = encoding;

    // Generate 64-byte salt (256/8 = 64)
    this.saltByte = 64;
};

Hasher.prototype.generateSalt = function (callback, urand=true) {
    let source = randomSource;
    if (!urand) source = timeSource;

    source.getRandomBytes(this.saltByte, (salt) => {
        callback(salt);
    });
};

Hasher.prototype.hash = function (pwd, callback, urand=true) {
    this.generateSalt((salt) => {
        crypto.pbkdf2(pwd, salt, this.iter, this.keylen, this.hashMethod, (err, key) => {
            if (err) console.error(err);
            const hashed = Hashed.create(key, salt, this.iter);
            callback(err, hashed);
        });
    }, urand)
};

Hasher.prototype.validate = function (new_, old, callback, enc) {
    const oldHash = Hashed.parse(old, enc || this.encoding);
    crypto.pbkdf2(new_, oldHash.salt, this.iter, this.keylen, this.hashMethod, (err, key) => {
        if (err) console.error(err);
        let valid = false;
        if (key.length === oldHash.key.length && key.equals(oldHash.key)) valid = true;
        callback(valid);
    });
};


module.exports = Hasher;

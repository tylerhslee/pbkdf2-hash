"use strict";

const Encoded = require("./Encoded");

/**
 * @constructor
 * @desc Stores hashed pass-phrase as decoded Strings.
 * @param {String} key - The decoded key
 * @param {String} salt - The decoded salt
 * @param {Number} iter - The number of PBKDF2 iterations
 */
function Decoded (key, salt, iter) {
    this.key = key;
    this.salt = salt;
    this.iter = iter;
}

/**
 * @method
 * @memberof Decoded
 * @desc Encodes the Decoded object into an Encoded object.
 * @param {String} enc - Encoding scheme to be used
 * @returns {Encoded} The Encoded object
 * @see Encoded
 */
Decoded.prototype.encode = function (enc) {
    const encodedKey = new Buffer(this.key, enc);
    const encodedSalt = new Buffer(this.salt, enc);
    const iter = this.iter;
    return new Encoded(encodedKey, encodedSalt, iter);
}

/**
 * @method
 * @memberof Decoded
 * @desc Concatenates the stored hash data into a hash string.
 * @desc The hash string has the format `iter:salt:key`.
 * @returns {String} The hash string
 */
Decoded.prototype.toString = function () {
    return `${this.iter}:${this.salt}:${this.key}`;
}

/**
 * @method
 * @memberof Decoded
 * @returns {String}
 */
Decoded.prototype.getKey = function () {
    return this.key;
}

/**
 * @method
 * @memberof Decoded
 * @param {Buffer} key
 */
Decoded.prototype.setKey = function (key) {
    this.key = key;
}

/**
 * @method
 * @memberof Decoded
 * @returns {Buffer}
 */
Decoded.prototype.getSalt = function () {
    return this.salt;
}

/**
 * @method
 * @memberof Decoded
 * @param {Buffer} salt
 */
Decoded.prototype.setSalt = function (salt) {
    this.salt = salt;
}

/**
 * @method
 * @memberof Decoded
 * @returns {Number}
 */
Decoded.prototype.getIteration = function () {
    return this.iter;
}

/**
 * @method
 * @memberof Decoded
 * @param {Number} iter
 */
Decoded.prototype.setIteration = function (iter) {
    this.iter = iter;
}


module.exports = Decoded;

"use strict";

const Decoded = require("./Decoded");


/**
 * @constructor
 * @desc Stores hashed pass-phrase as Buffers.
 * @param {Buffer} key - The hashed key
 * @param {Buffer} salt - The hashed salt
 * @param {Number} iter - The Number of PBKDF2 iterations
 */
function Encoded (key, salt, iter) {
  this.key = key;
  this.salt = salt;
  this.iter = iter;
}

/**
 * @method
 * @memberof Encoded
 * @desc Parses a hash string into an Encoded object.
 * @param {String} pass - The hash string
 * @param {String} enc - Encoding scheme to be used
 * @returns {Encoded} The Encoded object
 */
Encoded.parse = function (pass, enc) {
  const arr = pass.split(":");
  const key = new Buffer(arr[2], enc);
  const salt = new Buffer(arr[1], enc);
  const iter = parseInt(arr[0]);
  return new Encoded(key, salt, iter);
};

/**
 * @method
 * @memberof Encoded
 * @desc Decodes the Encoded object into a Decoded object.
 * @param {String} enc - Encoding scheme to be used
 * @returns {Decoded} The Decoded object
 * @see Decoded
 */
Encoded.prototype.decode = function (enc) {
  const decodedKey = this.getKey().toString(enc).toUpperCase();
  const decodedSalt = this.getSalt().toString(enc).toUpperCase();
  const iter = this.getIteration();
  return new Decoded(decodedKey, decodedSalt, iter);
};

/**
 * @method
 * @memberof Encoded
 * @desc Converts the stored hash data into a hash string.
 * @desc The hash string has the format <code>iter:salt:key</code>.
 * @param {String} enc - Encoding scheme to be used
 * @see Decoded#toString
 */
Encoded.prototype.toString = function (enc) {
  const decoded = this.decode(enc);
  return decoded.toString();
};

/**
 * @method
 * @memberof Encoded
 * @returns {Buffer}
 */
Encoded.prototype.getKey = function () {
  return this.key;
};

/**
 * @method
 * @memberof Encoded
 * @param {Buffer} key
 */
Encoded.prototype.setKey = function (key) {
  this.key = key;
};

/**
 * @method
 * @memberof Encoded
 * @returns {Buffer}
 */
Encoded.prototype.getSalt = function () {
  return this.salt;
};

/**
 * @method
 * @memberof Encoded
 * @param {Buffer} salt
 */
Encoded.prototype.setSalt = function (salt) {
  this.salt = salt;
};

/**
 * @method
 * @memberof Encoded
 * @returns {Number}
 */
Encoded.prototype.getIteration = function () {
  return this.iter;
};

/**
 * @method
 * @memberof Encoded
 * @param {Number} iter
 */
Encoded.prototype.setIteration = function (iter) {
  this.iter = iter;
};


module.exports = Encoded;

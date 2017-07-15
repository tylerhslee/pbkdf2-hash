"use strict";
const crypto = require("crypto");
const randomSource = require("randbytes").urandom.getInstance();
const timeSource = require("randbytes").timeRandom.getInstance();

const Encoded = require("./Encoded");
const Decoded = require("./Decoded");

/**
 * @constructor
 * @desc Creates and validates hashes. By default, this class uses 30,000 iterations, Hexadecimal encoding scheme, SHA-512 hashing method, and generates a 512-byte key.
 * @params {Number} iteration - Number of iterations to run
 * @params {String} encoding - The default encoding scheme to be used
 * @params {String} hashMethod - The default hashing method to be implemented by PBKDF2
 * @params {Number} keyLength - The length of the generated hash in bytes
 */
function Hasher (iteration, encoding, hashMethod, keyLength) {
    // Type validation (dotenv gives iteration as string, so just to be careful)
    if (typeof iteration !== "number") throw Error("Iteration must be number");
    this.iter = iteration;
    
    this.hashMethod = hashMethod;

    if (typeof keyLength !== "number") throw Error("Key length must be number");
    this.keylen = keyLength;

    this.encoding = encoding;
    
    /**
     * @type {Number}
     * @name Hasher~saltByte
     * @desc Length of the salt in bytes
     */
    // Generate 64-byte salt (256/8 = 64)
    const saltByte = 64;
    
    /**
     * @method
     * @instance
     * @param {Hasher~saltCallback} callback - Handles the randomly generated salt
     * @param {Boolean} [urand=true] - Determines whether to use <code>/dev/urandom</code> or the time stamp as the random source
     */
    this.generateSalt = function (callback, urand=true) {
        let source = randomSource;
        if (!urand) source = timeSource;

        source.getRandomBytes(saltByte, (salt) => {
            callback(salt);
        });
    }
    /**
     * This callback takes the randomly generated salt and allows it to be handled appropriately.
     * @callback Hasher~saltCallback
     * @param {Buffer} salt - Randomly generated salt
     */
};

/**
 * @method
 * @memberof Hasher
 * @desc Hashes the provided pass-phrase
 * @param {String} pwd - Password to hash
 * @param {Hasher~hashCallback} callback - Handles the hashed object
 * @param {Boolean} [urand=true] - Determines whether to use <code>/dev/urandom</code> or the time stamp as the random source
 */
Hasher.prototype.hash = function (pwd, callback, urand=true) {
    this.generateSalt((salt) => {
        crypto.pbkdf2(pwd, salt, this.iter, this.keylen, this.hashMethod, (err, key) => {
            if (err) console.error(err);
            const hashed = new Encoded(key, salt, this.iter);
            callback(err, hashed);
        });
    }, urand)
};
/**
 * This callback takes the generated hash as an {@link Encoded} object. It also handles any errors from the PBKDF2 process.
 * @callback Hasher~hashCallback
 * @param {Object} err
 * @param {Encoded} hashed - The hashed object
 * @see Encoded
 */

/**
 * @method
 * @memberof Hasher
 * @param {String} new_ - Given pass-phrase
 * @param {String} old - The encoded hash string to compare to
 * @param {Hasher-validatorCallback} callback - Handles the validation result
 * @param {String=} - The encoding scheme to be used (uses <code>hasher.encoding</code> as default)
 * @example
 * // Create a hash
 * hasher.hash("password", (err, hashed) => {
 *     const old = hashed.toString(hasher.encoding); // Generate hash string with default encoding scheme
 *     hasher.validate("password", old, (valid) => {
 *         assert.equal(valid, true);
 *     });
 * });
 */
Hasher.prototype.validate = function (new_, old, callback, enc) {
    const oldHash = Encoded.parse(old, enc || this.encoding);
    crypto.pbkdf2(new_, oldHash.getSalt(), this.iter, this.keylen, this.hashMethod, (err, key) => {
        if (err) console.error(err);
        let valid = false;
        if (key.length === oldHash.getKey().length && key.equals(oldHash.getKey())) valid = true;
        callback(valid);
    });
};
/**
 * This callback handles the validation result.
 * @callback Hasher~validatorCallback
 * @param {Boolean} valid - Validation test result
 */


module.exports = Hasher;

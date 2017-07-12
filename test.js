/* Mocha test script for PBKDF2 implementation.
 */



"use strcit";
require("dotenv").config();

const mocha    = require("mocha")
    , describe = mocha.describe
    , it       = mocha.it;

const expect = require("chai").expect;

const pbkdf = require("./index.js")
    , hasher = pbkdf.create();

const PASSWORD = "password";

describe("PBKDF2 Hasher", () => {
    
    describe("Using /dev/urandom as the random source", () => {

        it("Creates a hashed pass-phrase", (done) => {
            hasher.hash(PASSWORD, (err, hashed) => {
                expect(hashed).to.be.an("object");
                expect(hashed.iter).to.equal(parseInt(process.env.ITERATION));
                expect(/^\d{5}\:\s+:\s+/.test(hashed.toString()));
                done();
            });
        });

        it("Compares two pass-phrases", (done) => {
            hasher.hash(PASSWORD, (err, hashed) => {
                if (err) console.error(err);
                const old = hashed.toString(hasher.encoding);
                hasher.validate(PASSWORD, old, (valid) => {
                    expect(valid).to.equal(true);
                    done();
                });
            });
        });

    });

    describe("Using timeRandom as the random source", () => {

        it("Creates a hashed pass-phrase", (done) => {
            hasher.hash(PASSWORD, (err, hashed) => {
                expect(hashed).to.be.an("object");
                expect(hashed.iter).to.equal(parseInt(process.env.ITERATION));
                expect(/^\d{5}\:\s+:\s+/.test(hashed.toString()));
                done();
            }, false);
        });

    })

});

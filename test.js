/* Mocha test script for PBKDF2 implementation.
 */



"use strcit";

const mocha    = require("mocha")
  , describe = mocha.describe
  , it       = mocha.it;

const expect = require("chai").expect;

const pbkdf = require("./index.js")
  , hasher = pbkdf.create()
  , hasherAsync = pbkdf.createAsync();

const PASSWORD = "password";


describe("PBKDF2 Hasher", () => {
    
  describe("Using /dev/urandom as the random source", () => {

    it("Creates a hashed pass-phrase", (done) => {
      hasher.hash(PASSWORD, (err, hashed) => {
        expect(hashed).to.be.an("object");
        expect(hashed.iter).to.be.a("number");
        expect(/^\d{5}\:\s+:\s+/.test(hashed.toString()));
        done();
      });
    });

    it("Compares two pass-phrases", (done) => {
      hasher.hash(PASSWORD, (err, hashed) => {
        if (err) console.error(err);
        const old = hashed.toString(hasher.encoding);
        hasher.validate(PASSWORD, old, (err, valid) => {
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
        expect(hashed.iter).to.be.a("number");
        expect(/^\d{5}:\s+:\s+/.test(hashed.toString()));
        done();
      }, false);
    });

  });

  describe("Using Async/await", () => {
        
    it("creates a hashed pass-phrase", async () => {
      try {
        const hashed = await hasherAsync.hash(PASSWORD);
        expect(hashed.iter).to.be.a("number");
      }
      catch (err) {
        console.error(err);
      }
    });

    it("compares two pass-phrases", async () => {
      const old = await hasherAsync.hash(PASSWORD).toString(hasherAsync.encoding);
      try {
        const valid = await hasherAsync.validate(PASSWORD, old);
        expect(valid).to.equal(true);
      }
      catch (err) {
        console.error(err);
      }
    })

  });

});

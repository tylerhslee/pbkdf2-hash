# Hashing with PBKDF2
This package creates a hash using the PBKDF2 method. 

Random salts are generated using the `randbytes` package. It can be downloaded on npm [here](https://www.npmjs.com/package/randbytes).

## Usage
### `Hasher` object
The `Hasher` object is what generates hashes. The salt is randomly generated through `/dev/urandom`.

```javascript
const pbkdf = require("pbkdf2-hash")
    , hasher = pbkdf.create();

hasher.hash("password", (err, hashed) => {
    console.log(hashed.toString(hasher.encoding));
});
```

The hasher can take 4 optional arguments: `iteration`, `encoding`, `method`, and `keylen`. By default, the following constructor is called upon the call to `create()`:

```javascript
const options = {
    iteration: 30000,
    encoding: "hex",
    method: "sha512",
    keylen: 512
};
const hasher = pbkdf.create(options);
assert.equal(hasher.iteration, pbkdf.create().iteration);
assert.equal(hasher.encoding, pbkdf.create().encoding);
assert.equal(hasher.method, pbkdf.create().method);
assert.equal(hashser.keylen, pbkdf.create().keylen);
```

`encoding` is a convenience property to set a global encoding scheme across the project. It is a good way to keep track of your Strings and Buffers as they can get mixed up if one is not careful enough.

If you are on a non-UNIX system, you can choose to generate random salt with a time stamp instead. For more information, check [here](https://tylerhslee.github.io/pbkdf2-hash/Hasher.html#hash_anchor). However, this is not recommended and should not be used unless absolutely necessary.

### `Encoded` and `Decoded` objects that store the hashed data
The `hash()` method returns an [`Encoded`](https://tylerhslee.github.io/pbkdf2-hash/Encoded.html) object, which contains hashed data in Buffers. These data can be decoded into [`Decoded`](https://tylerhslee.github.io/pbkdf2-hash/Hasher.html) objects if string vales are needed.

```javascript
hasher.hash("password", (err, hashed) => {
    console.log(hashed.toString(hasher.encoding));
    
    // If you want a different encoding scheme...
    console.log(hashed.toString("utf8"));
});
```

It can also be used to parse an already stringified hash.
```javascript
hasher.hash("password", (err, hashed) => {
    const h1 = hashed;
    const h2 = hashed.parse(hashed.toString(hasher.encoding), hasher.encoding);
    assert.equal(JSON.stringify(h1)).equal(JSON.stringify(h2));
});
```

### Comparing hashes
You can use the `verify()` method to compare two pass-phrases. The first argument is the entered password, and the second argument is the hashed password to be compared to.

```javascript
hasher.hash("password", (err, hashed) => {
    const old = hashed.toString(hasher.encoding);
    hasher.validate("password", old, (err, valid) => {
        if (err) console.error(err);
        console.log(valid);  // true
    });
});
```

The `verify()` method uses `hasher.encoding` by default, but this can be overridden by supplying the optional parameter at the end.

```javascript
hasher.verify(..., (err, valid) => {
    if (err) console.error(err);
    // Do something
}, "utf8");
```

### Asynchronous Hasher
This module also makes it possible to work with promises.

```javascript
const hasherAsync = require("pbkdf2-hash").createAsync();

hasherAsync.hash("password")
    .then(hashed => { /* Do something */  })
    .catch(err => { /* Handle error */ });

hasherAsync.hash("password")
    .then(hashed => {
        const old = hashed.toString(hasherAsync.encoding);
        hasherAsync.verify("password", old)
            .then(valid => { console.log(valid);  // true })
            .catch(err => { /* Handle error */ });
    })
    .catch(err => { /* Handle error */ });
```
## Documentation
A full documentation can be found [here](https://tylerhslee.github.io/pbkdf2-hash/index.html).

## Changelog
### Version 2.2.0
#### Deprecated
  * `hasher.validate` method has been deprecated in favor of `hasher.verify`. This change has been made to promisify the API. The usage is only slightly different - `hasher.verify` pass an `Error` object in addition to the `valid` parameter.

#### Added
  * `hasher.hashAsync` method has been added as a way to work with promises.

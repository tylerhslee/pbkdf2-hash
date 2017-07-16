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
You can use the `validate()` method to compare two pass-phrases. The first argument is the entered password, and the second argument is the hashed password to be compared to.

```javascript
hasher.hash("password", (err, hashed) => {
    const old = hashed.toString(hasher.encoding);
    hasher.validate("password", old, (valid) => {
        return valid;
    });
});
```

The `validate()` method uses `hasher.encoding` by default, but this can be overridden by supplying the optional parameter at the end.

```javascript
hasher.validate(..., (valid) => {
    // Do something
}, "utf8");
```

## Documentation
A full documentation can be found [here](https://tylerhslee.github.io/pbkdf2-hash/index.html).

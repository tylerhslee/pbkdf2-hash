# Hashing with PBKDF2
This package creates a hash using the PBKDF2 method. By default, it iterates on 64-bit SHA256 hash.

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
});
```

If you are on a non-UNIX system, you can choose to generate random salt with a time stamp instead. To do so, you simply have to pass `false` to the method:

```javascript
hasher.hash("password", (err, hashed) => {
    // Do something
}, false);
```

However, this is unrecommended and should not be used unless absolutely necessary.

### `Hashed` object
The `hash()` method returns a `Hashed` object, which can be converted to a hex string (by default) easily.

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
    hashed.parse(hashed.toString(hasher.encoding), hasher.encoding) === hashed  // true
});
```

### Comparing hashes
You can use the `validate()` method to compare two pass-phrases. The first argument is the entered password, and the second argument is the hashed password to be compared to.

```javascript
hasher.hash("password", (err, hashed) => {
    const old = hashed.toString(hasher.encoding);
    hasher.validate("password", old, (valid) => {
        return valid  // true
    });
});
```

The `validate()` method uses `hasher.encoding` by default, but this can be overridden by supplying the optional parameter at the end.

```javascript
hasher.validate(..., (valid) => {
    // Do something
}, "utf8");
```

var bc = require('bcrypt')

// console.log(cryptojs.AES.encrypt('123456','ayushTamboli').toString())

bc.hash('nic@1234', 10, function (err, hash) {
    console.log(hash)
});
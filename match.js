var bcrypt = require('bcrypt');

bcrypt.compare('123456','$2b$10$g06PeJQTicYx.mZ1hEGYcuOuV73MjDQrd4ia3u/LShxMPUwkaKahy', (err, resp) => {
    console.log(resp)
})
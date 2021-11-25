const jwt = require('jsonwebtoken')
const {readFile} = require('fs')

// retrieve(user, (err, data) => {
//     if (err) res.send(err.message)
//     else {
//         const token = jwt.sign({ sub: data.id, exp: Math.floor(Date.now() / 1000) + 3600 }, SECRET)

//         res.send({token})
//     }
// })

/**
 * 
 * @param {*} user 
 * @param {*} secret 
 * @param {*} callback 
 */

const auth = (user, secret, callback) => {
    const {email: _email, password: _password} = user
    
    readFile(`${__dirname}/../users.json`, 'utf-8', (err, json) => {
        if (err) callback(new Error(err.message))
   
        const users = JSON.parse(json)
        const user = users.find((user) => user.email === _email && user.password === _password)
        if (!user) callback(new Error('Wrong credentials'))
        const id = user.id
        if (!id) callback(new Error('User not found'))

        const token = jwt.sign({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600 }, secret)

        callback(null, token)

    })
    
}

module.exports = auth
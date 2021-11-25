const context = require('./context')
const { ObjectId } = require('mongodb')

function modifyUser(id, data, callback) { // data => { name: ?, username: ?, password: ? }
    if (typeof id !== 'string') throw new TypeError('id is not a string')
    if (!id.trim().length) throw new Error('id is empty or blank')
    if (/\r?\n|\r|\t| /g.test(id)) throw new Error('id has blank spaces')
    if (id.length !== 24) throw new Error('id doesn\'t have 24 characters')

    if (typeof data !== 'object' || data.constructor.name !== 'Object') throw new TypeError('data is not an object')

    const { name, username, oldPassword, password } = data

    if (typeof name !== 'undefined') {
        if (typeof name !== 'string') throw new TypeError('name is not a string')
        if (!name.trim().length) throw new Error('name is empty or blank')
        if (name.trim() !== name) throw new Error('blank spaces around name')
    }

    if (typeof username !== 'undefined') {
        if (typeof username !== 'string') throw new TypeError('username is not a string')
        if (!username.trim().length) throw new Error('username is empty or blank')
        if (/\r?\n|\r|\t| /g.test(username)) throw new Error('username has blank spaces')
        if (username.length < 4) throw new Error('username has less than 4 characters')
    }

    if (typeof oldPassword === 'undefined' && typeof password !== 'undefined') throw new Error('old password is not defined')
    if (typeof password === 'undefined' && typeof oldPassword !== 'undefined') throw new Error('password is not defined')

    if (typeof password !== 'undefined') {
        if (typeof password !== 'string') throw new TypeError('password is not a string')
        if (!password.trim().length) throw new Error('password is empty or blank')
        if (/\r?\n|\r|\t| /g.test(password)) throw new Error('password has blank spaces')
        if (password.length < 8) throw new Error('password has less than 8 characters')
    }

    if (typeof oldPassword !== 'undefined') {
        if (typeof oldPassword !== 'string') throw new TypeError('old password is not a string')
        if (!oldPassword.trim().length) throw new Error('old password is empty or blank')
        if (/\r?\n|\r|\t| /g.test(oldPassword)) throw new Error('old password has blank spaces')
        if (oldPassword.length < 8) throw new Error('old password has less than 8 characters')
    }

    if (typeof callback !== 'function') throw new TypeError('callback is not a function')

    const users = context.db.collection('users')

    users.findOne({ _id: ObjectId(id) }, (error, user) => {
        if (error) return callback(error)
        if (!user) return callback(new Error(`No user found with id ${id}`))

        const { password, oldPassword } = data

        if (password) {
            if (oldPassword !== user.password)
                return callback(new Error(`Wrong credentials`))
            else
                delete data.oldPassword
        }
        users.updateOne({ _id: ObjectId(id) }, {$set : data}, error => {
            if (error) {
                if (error.code === 11000) return callback(new Error(`user with Username ${data.username} already exists`))
                else return callback(error)
            }
            callback(null)
        })
    })


}
module.exports = modifyUser
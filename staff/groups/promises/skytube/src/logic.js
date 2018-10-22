import Skylab from './skylab'

const logic = {
    skylab: new Skylab(),
    auth: JSON.parse(sessionStorage.getItem('auth')) || {},

    registerUser(name, surname, username, email, password) {
        if(typeof name !=='string') throw TypeError (`${name} is not a string`)
        if (!name.trim()) throw Error ('name is blank or empty')

        if(typeof surname !=='string') throw TypeError (`${surname} is not a string`)
        if (!surname.trim()) throw Error ('surname is blank or empty')

        if(typeof username !=='string') throw TypeError (`${username} is not a string`)
        if (!username.trim()) throw Error ('username is blank or empty')

        if(typeof email !=='string') throw TypeError (`${email} is not a string`)
        if (!email.trim()) throw Error ('email is blank or empty')

        if(typeof password !=='string') throw TypeError (`${password} is not a string`)
        if (!password.trim()) throw Error ('password is blank or empty')

        return this.skylab.register({
            name: name,
            surname: surname,
            username: username,
            email: email,
            password: password
        })
    },

    loginUser(username, password) {
        if(typeof username !=='string') throw TypeError (`${username} is not a string`)
        if (!username.trim()) throw Error ('username is blank or empty')

        if(typeof password !=='string') throw TypeError (`${password} is not a string`)
        if (!password.trim()) throw Error ('password is blank or empty')

        return this.skylab.login({
            username: username,
            password: password
        })
            .then(data => {
                this.auth.user_id = data.id
                this.auth.token = data.token
                sessionStorage.setItem('auth', JSON.stringify({user_id: data.id, token: data.token}))
            })
    },

    logoutUser() {
        sessionStorage.removeItem('auth')
        this.auth = {}
    },

    isAuthenticated() {
        return this.auth && Object.keys(this.auth).length > 0
    },

    addPlaylist(playlist) {
        return this.skylab.update(playlist, this.auth.token)
    }
}

export default logic

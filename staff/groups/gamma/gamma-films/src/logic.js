import data from "./data"

const { User } = data

const logic = {

    _user: "",
    _userId: "",
    _token: "",
    _movies: "",


    registUser(name, surname, username, password) {

        const user = new User(name, surname, username, password)
        console.log(name, surname, username, password)
        this._user = user
        console.log(this._user)
        return fetch('https://skylabcoders.herokuapp.com/api/user', {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    loginUser(username, password) {
        return fetch('https://skylabcoders.herokuapp.com/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token
                console.log(this._token)

                // sessionStorage.setItem('userId', id)
                // sessionStorage.setItem('token', token)
            })
    },

    get loggedIn() {
        return !!this._userId
    },

    searchMovies(query) {

        console.log(query)
        return fetch('https://api.themoviedb.org/3/search/movie?api_key=e187746b7167e4886a5d0a2f1ead5a18&query=hola' , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const results= res.results

                this._movies=results;
            })
    },

    get movies() {
        return this._movies
    }
}

export default logic
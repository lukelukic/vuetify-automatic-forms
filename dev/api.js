import axios from "axios"

export default axios.create({
    baseURL: 'http://localhost:500',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
    }
})
import axios from 'axios'

export default axios.create({
  baseURL: 'http://ec2-3-120-128-154.eu-central-1.compute.amazonaws.com:5000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

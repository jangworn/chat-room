import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8199',
    options: {
      transports: ['websocket'],
      autoConnect: true
    }
  }))
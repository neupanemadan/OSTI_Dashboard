import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import {auth} from './auth'
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(auth, { router })
app.use(pinia)
app.mount('#app')

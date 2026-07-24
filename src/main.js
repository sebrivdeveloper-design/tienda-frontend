import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
import { configurarInterceptoresAxios } from './services/httpInterceptors'

configurarInterceptoresAxios()

createApp(App)
  .use(router)
  .mount('#app')
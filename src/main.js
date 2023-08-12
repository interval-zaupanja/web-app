import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ni potrebno specificirati index.js, ker to že avtomatsko povzame iz mape

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

createApp(App).use(router).mount('#app')
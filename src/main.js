import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ni potrebno specificirati index.js, ker to že avtomatsko povzame iz mape

createApp(App).use(router).mount('#app')
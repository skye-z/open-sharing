import { createApp } from 'vue'
import App from './App.vue'
import router from '@/plugins/router'
import 'element-plus/dist/index.css'
import ep from 'element-plus'

createApp(App).use(router).use(ep).mount('#app')
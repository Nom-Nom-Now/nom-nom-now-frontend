import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

//material design
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';

const app = createApp(App);

app.use(router);

app.mount('#app');

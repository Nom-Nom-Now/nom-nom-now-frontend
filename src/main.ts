import { createApp } from 'vue';
import './style.css';
import './material.ts';
import App from './App.vue';
import router from './router';
import i18n from './locales';

//material design
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';

const app = createApp(App);

app.use(i18n);
app.use(router);

app.mount('#app');

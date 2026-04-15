import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import './material.ts';
import App from './App.vue';
import router from './router';
import i18n from './locales';

//material design
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/select/outlined-select.js';
import '@material/web/icon/icon.js';

const app = createApp(App);
const pinia = createPinia();

app.use(i18n);
app.use(router);
app.use(pinia);

app.mount('#app');

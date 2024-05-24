// import { createApp } from 'vue'
// import App from './App.vue'
import './index.css'

// import KG_ingredient from './components/KG_ingredients/KG_ingredients.vue'
import KG_categories from './components/KG_categories/KG_categories.vue'
// import KG_categories_benefits from './components/KG_categories_benefits/KG_categories_benefits.vue'
// import FlowerComponent from './components/Flower/Flower.vue'
// import CosmeticsList from './pages/CosmeticsList.vue'

// createApp(App)
// .component('KG_ingredient', KG_ingredient)
// .component('KG_categories', KG_categories)
// .component('KG_categories_benefits', KG_categories_benefits)
// .component('FlowerComponent', FlowerComponent)
// .component('CosmeticList', CosmeticsList)
// .mount('#app')

import { createApp } from 'vue';
import App from './App.vue';
import router from './utils/routers';

const app = createApp(App);
// .component('FlowerComponent', FlowerComponent);
// .component('KG_categories', KG_categories);
app.use(router);
app.mount('#app');
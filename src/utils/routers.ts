import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import KG_ingredients from '../components/KG_ingredients/KG_i_benefits.vue';
import KG_categories from '../components/KG_categories/KG_categories.vue';
import KG_categories_benefits from '../components/KG_ingredients/KG_i_categories_benefits.vue';
import CosmeticsList from '../pages/CosmeticsList.vue';
import polarBar from '../components/StackedBar/polarBar_lipid.vue'
import FlowerLovingIngredients from '../components/Flower/FlowerLovingIngredients.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/kg-ingredient', component: KG_ingredients },
  { path: '/kg-categories', component: KG_categories },
  { path: '/kg-categories-benefits', component: KG_categories_benefits },
  { path: '/cosmetic-list', component: CosmeticsList },
  { path: '/static/polarbar-lipid', component: polarBar},
  { path: '/loving-ingredients', component: FlowerLovingIngredients},
  { path: '/', redirect: '/cosmetic-list' },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
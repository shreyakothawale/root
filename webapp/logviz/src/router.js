import ResultPage from './components/ResultPage.vue'
import IDForm from './components/IDForm.vue'

import { createRouter,createWebHistory} from 'vue-router'


const routes = [
  // other routes
  {
    path: '/result',
    name: 'ResultPage',
    component: ResultPage,
  },
  {
    path: '/',
    name: 'IDForm',
    component: IDForm
  }
]

const router =  createRouter(
  {
    history:createWebHistory(),
    routes,
  }
)

export default router

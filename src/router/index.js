import { createRouter, createWebHistory } from 'vue-router';
import Domov from '../views/Domov.vue';
import ONas from '../views/ONas.vue';
import Ankete from '../views/Ankete/Ankete.vue';
import Anketa from '../views/Ankete/Anketa.vue';

const router = new createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Domov',
            component: Domov
        },
        {
            path: '/o-nas',
            name: 'About',
            component: ONas
        },
        {
            path: '/ankete',
            name: 'Ankete',
            component: Ankete
        },
        {
            path: '/ankete/:id',
            name: 'Anketa',
            component: Anketa,
            props: true
        }
    ]
})

export default router;
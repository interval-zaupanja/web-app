import { createRouter, createWebHistory } from 'vue-router'
import Domov from '@/views/Domov.vue'
import ONas from '@/views/ONas.vue'
import PogojiUporabe from '@/views/PogojiUporabe.vue'
import PrijavljeneNapake from '@/views/PrijavljeneNapake.vue'
import Ankete from '@/views/Ankete/Ankete.vue'
import Anketa from '@/views/Ankete/Anketa.vue'
import Stranke from '@/views/Stranke/Stranke.vue'
import Stranka from '@/views/Stranke/Stranka.vue'
import Narocniki from '@/views/Narocniki/Narocniki.vue'
import Narocnik from '@/views/Narocniki/Narocnik.vue'
import Izvajalci from '@/views/Izvajalci/Izvajalci.vue'
import Izvajalec from '@/views/Izvajalci/Izvajalec.vue'
import Glasovanja from '@/views/Glasovanja/Glasovanja.vue'
import Glasovanje from '@/views/Glasovanja/Glasovanje.vue'
import NotFound from '@/views/NiNajdeno.vue'

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
            path: '/pogoji-uporabe',
            name: 'Pogoji uporabe',
            component: PogojiUporabe
        },
        {
            path: '/prijavljene-napake',
            name: 'Prijavljene napake',
            component: PrijavljeneNapake
        },
        {
            path: '/ankete',
            name: 'Ankete',
            component: Ankete,
            props: true
        },
        {
            path: '/ankete/:id',
            name: 'Anketa',
            component: Anketa,
            props: true
        },
        {
            path: '/stranke',
            name: 'Stranke',
            component: Stranke
        },
        {
            path: '/stranke/:id',
            name: 'Stranka',
            component: Stranka,
            props: true
        },
        {
            path: '/narocniki',
            name: 'Narocniki',
            component: Narocniki
        },
        {
            path: '/narocniki/:id',
            name: 'Narocnik',
            component: Narocnik,
            props: true
        },
        {
            path: '/izvajalci',
            name: 'Izvajalci',
            component: Izvajalci
        },
        {
            path: '/izvajalci/:id',
            name: 'Izvajalec',
            component: Izvajalec,
            props: true
        },
        {
            path: '/glasovanja',
            name: 'Glasovanja',
            component: Glasovanja,
        },
        {
            path: '/glasovanja/:id',
            name: 'Glasovanje',
            component: Glasovanje,
            props: true
        },
        // Catch all not found
        {
            path: '/:catchAll(.*)', // to je regex
            name: 'NotFound',
            component: NotFound
        }
    ]
})

export default router;
import { createRouter, createWebHistory } from 'vue-router'

import Domov from '@/views/Domov.vue'
import ONas from '@/views/ONas.vue'
import PogojiUporabe from '@/views/PogojiUporabe.vue'
import PrijavljeneNapake from '@/views/PrijavljeneNapake.vue'
import Ankete from '@/views/Ankete/Ankete.vue'
import Anketa from '@/views/Ankete/Anketa.vue'
import Stranke from '@/views/Stranke/Stranke.vue'
import Stranka from '@/views/Stranke/Stranka.vue'
import Zalozniki from '@/views/Zalozniki/Zalozniki.vue'
import Narocnik from '@/views/Zalozniki/Zaloznik.vue'
import Izvajalci from '@/views/Izvajalci/Izvajalci.vue'
import Izvajalec from '@/views/Izvajalci/Izvajalec.vue'
import Glasovanja from '@/views/Glasovanja/Glasovanja.vue'
import Glasovanje from '@/views/Glasovanja/Glasovanje.vue'
import Osebe from '@/views/Osebe/Osebe.vue'
import Oseba from '@/views/Osebe/Oseba.vue'
import Priljubljenost from '@/views/Priljubljenost.vue'
import NotFound from '@/views/NiNajdeno.vue'

const router = new createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Domov',
            component: Domov,
            meta: {
                title: ''
            }
        },
        {
            path: '/o-nas',
            name: 'About',
            component: ONas,
            meta: {
                title: 'O nas'
            }
        },
        {
            path: '/pogoji-uporabe',
            name: 'Pogoji uporabe',
            component: PogojiUporabe,
            meta: {
                title: 'Pogoji uporabe'
            }
        },
        {
            path: '/prijavljene-napake',
            name: 'Prijavljene napake',
            component: PrijavljeneNapake,
            meta: {
                title: 'Prijavljene napake'
            }
        },
        {
            path: '/ankete',
            name: 'Ankete',
            component: Ankete,
            props: true,
            meta: {
                title: 'Ankete'
            }
        },
        {
            path: '/ankete/:id',
            name: 'Anketa',
            component: Anketa,
            props: true,
            meta: {
                title: 'Anketa'
            }
        },
        {
            path: '/stranke',
            name: 'Stranke',
            component: Stranke,
            meta: {
                title: 'Stranke'
            }
        },
        {
            path: '/stranke/:id',
            name: 'Stranka',
            component: Stranka,
            props: true
        },
        {
            path: '/zalozniki',
            name: 'Zalozniki',
            component: Zalozniki,
            meta: {
                title: 'Založniki'
            }
        },
        {
            path: '/zalozniki/:id',
            name: 'Narocnik',
            component: Narocnik,
            props: true
        },
        {
            path: '/izvajalci',
            name: 'Izvajalci',
            component: Izvajalci,
            meta: {
                title: 'Izvajalci'
            }
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
            meta: {
                title: 'Glasovanja'
            }
        },
        {
            path: '/glasovanja/:id',
            name: 'Glasovanje',
            component: Glasovanje,
            props: true
        },
        {
            path: '/osebe',
            name: 'Osebe',
            component: Osebe,
            meta: {
                title: 'Osebe'
            }
        },
        {
            path: '/osebe/:id',
            name: 'Oseba',
            component: Oseba,
            props: true
        },
        {
            path: '/priljubljenost',
            name: 'Priljubljenost',
            component: Priljubljenost,
            meta: {
                title: 'Priljubljenost'
            }
        },
        // Catch all not found
        {
            path: '/:catchAll(.*)', // to je regex
            name: 'NotFound',
            component: NotFound,
            meta: {
                title: 'Stran ne obstaja'
            }
        }
    ]
})

router.beforeEach((to) => {
    if (to.meta?.title != null && to.meta?.title != undefined && to.meta?.title != '') {
        document.title = 'Interval zaupanja | ' + to.meta?.title
    } else {
        document.title = 'Interval zaupanja'
    }
    
})

export default router;
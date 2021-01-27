
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/search',
    component: () => import('layouts/ResultsLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Search.vue'),
        props: route => ({ query: route.query.q })
      }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

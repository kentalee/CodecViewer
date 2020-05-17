import Vue from 'vue';

import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
	mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			meta: {
				title: 'Codec# Viewer',
			},
			component: () => import('@/views/Home.vue'),
		},
	],
});

router.beforeEach(async (to, from, next) => {
	document.title = to?.meta?.title || '';
	next();
});

export default router;

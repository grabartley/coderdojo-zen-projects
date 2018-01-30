import Vue from 'vue';
import Router from 'vue-router';
import Upload from '@/components/Upload';
import Runtime from '@/components/Runtime';
import Acknowledgements from '@/components/Acknowledgements';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Upload',
      component: Upload,
    },
    {
      path: '/run',
      name: 'Runtime',
      component: Runtime,
    },
    {
      path: '/acknowledgements',
      name: 'Acknowledgements',
      component: Acknowledgements,
    },
  ],
});
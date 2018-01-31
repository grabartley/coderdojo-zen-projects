import Vue from 'vue';
import Router from 'vue-router';
import ProjectList from '@/components/project-list';
import ProjectCreationForm from '@/components/project-creation-form';
import Runtime from '@/components/Runtime';
import Acknowledgements from '@/components/Acknowledgements';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ProjectList',
      component: ProjectList,
    },
    {
      path: '/create-project',
      name: 'ProjectCreationForm',
      component: ProjectCreationForm,
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
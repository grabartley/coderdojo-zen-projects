import Vue from 'vue';
import Router from 'vue-router';
import ProjectList from '@/components/project-list';
import ProjectDetails from '@/components/project-details';
import ProjectCreationForm from '@/components/project-creation-form';
import ProjectRuntime from '@/components/project-runtime';
import Acknowledgements from '@/components/acknowledgements';
import Login from '@/components/login';
import ViewProfile from '@/components/view-profile';
import EditProfile from '@/components/edit-profile';
import GitHubCallback from '@/components/github-callback';

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
      path: '/project/:projectId',
      name: 'ProjectDetails',
      component: ProjectDetails,
    },
    {
      path: '/create-project',
      name: 'ProjectCreationForm',
      component: ProjectCreationForm,
    },
    {
      path: '/run',
      name: 'ProjectRuntime',
      component: ProjectRuntime,
    },
    {
      path: '/acknowledgements',
      name: 'Acknowledgements',
      component: Acknowledgements,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/view-profile/:userId',
      name: 'ViewProfile',
      component: ViewProfile,
    },
    {
      path: '/edit-profile/:userId',
      name: 'EditProfile',
      component: EditProfile,
    },
    {
      path: '/users/integrations/github',
      name: 'GitHubCallback',
      component: GitHubCallback,
    },
  ],
});
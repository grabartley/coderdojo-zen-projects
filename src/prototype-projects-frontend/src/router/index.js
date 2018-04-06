import Vue from 'vue';
import Router from 'vue-router';
import ProjectList from '@/projects/project-list';
import ProjectDetails from '@/projects/project-details';
import EditProject from '@/projects/edit-project';
import ProjectCreationForm from '@/projects/project-creation-form';
import ProjectRuntime from '@/projects/project-runtime';
import Acknowledgements from '@/common/acknowledgements';
import Login from '@/users/login';
import ViewProfile from '@/users/view-profile';
import EditProfile from '@/users/edit-profile';
import GitHubCallback from '@/dojos/github-callback';

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
      path: '/edit-project/:projectId',
      name: 'EditProject',
      component: EditProject,
    },
    {
      path: '/create-project',
      name: 'ProjectCreationForm',
      component: ProjectCreationForm,
    },
    {
      path: '/run-project/:projectId',
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
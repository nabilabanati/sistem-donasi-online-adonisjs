/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const KategorisController = () => import('#controllers/kategoris_controller')
const KampanyesController = () => import('#controllers/kampanyes_controller')
const DonatursController = () => import('#controllers/donaturs_controller')
const DonasisController = () => import('#controllers/donasis_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.get('/login', [AuthController, 'showLogin']).as('login')
    router.post('/login', [AuthController, 'login'])
    router.get('/register', [AuthController, 'showRegister']).as('register')
    router.post('/register', [AuthController, 'register'])
  })
  .use(middleware.guest())

router.post('/logout', [AuthController, 'logout']).as('logout')

router
  .group(() => {
    // dashboard
    router.get('/', [DashboardController, 'index']).as('dashboard')

    //kategori
    router
      .group(() => {
        router.get('/', [KategorisController, 'index']).as('index')
        router.get('/create', [KategorisController, 'create']).as('create')
        router.post('/create', [KategorisController, 'save']).as('save')
        router.get('/:id', [KategorisController, 'show']).as('show')
        router.get('/:id/edit', [KategorisController, 'edit']).as('edit')
        router.post('/:id/edit', [KategorisController, 'update']).as('update')
        router.post('/:id/delete', [KategorisController, 'destroy']).as('destroy')
      })
      .prefix('/kategori')
      .as('kategori')

    //kampanye
    router
      .group(() => {
        router.get('/', [KampanyesController, 'index']).as('index')
        router.get('/create', [KampanyesController, 'create']).as('create')
        router.post('/create', [KampanyesController, 'save']).as('save')
        router.get('/:id', [KampanyesController, 'show']).as('show')
        router.get('/:id/edit', [KampanyesController, 'edit']).as('edit')
        router.post('/:id/edit', [KampanyesController, 'update']).as('update')
        router.post('/:id/delete', [KampanyesController, 'destroy']).as('destroy')
      })
      .prefix('/kampanye')
      .as('kampanye')

    //donatur
    router
      .group(() => {
        router.get('/', [DonatursController, 'index']).as('index')
        router.get('/create', [DonatursController, 'create']).as('create')
        router.post('/create', [DonatursController, 'save']).as('save')
        router.get('/:id', [DonatursController, 'show']).as('show')
        router.get('/:id/edit', [DonatursController, 'edit']).as('edit')
        router.post('/:id/edit', [DonatursController, 'update']).as('update')
        router.post('/:id/delete', [DonatursController, 'destroy']).as('destroy')
      })
      .prefix('/donatur')
      .as('donatur')

    //donasi
    router
      .group(() => {
        router.get('/', [DonasisController, 'index']).as('index')
        router.get('/create', [DonasisController, 'create']).as('create')
        router.post('/create', [DonasisController, 'save']).as('save')
        router.get('/:id', [DonasisController, 'show']).as('show')
        router.get('/:id/edit', [DonasisController, 'edit']).as('edit')
        router.post('/:id/edit', [DonasisController, 'update']).as('update')
        router.post('/:id/updateStatus', [DonasisController, 'updateStatus']).as('updateStatus')
        router.post('/:id/delete', [DonasisController, 'destroy']).as('destroy')
      })
      .prefix('/donasi')
      .as('donasi')
  })
  .use(middleware.auth({ guards: ['web'] }))

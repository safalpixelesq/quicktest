'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
	Route.get('/users', 'AuthController.users')
	// Route.get('/projects', 'ProjectController.all')
}).prefix('admin/api')

Route.group(() => {
	Route.post('/signup', 'AuthController.signup').validator('Signup')
	Route.post('/login', 'AuthController.login')
	Route.post('/verify-user', 'AuthController.verifyUser')
	Route.get('/confirm/email/:token', 'AuthController.confirmEmail')
	Route.get('/revoke/token', 'AuthController.confirmEmail').middleware([
		'auth:jwt',
	])
	Route.post('forgot/password', 'AuthController.forgotPassword')
	Route.post('reset/password', 'AuthController.resetPassword')
	Route.get('/social/:provider', 'AuthController.redirectToProvider').as(
		'social.login'
	)
	Route.get(
		'/authenticated/:provider',
		'AuthController.handleProviderCallback'
	).as('social.login.callback')
}).prefix('api/auth')

// Remove the lib prefix above ^

Route.group(() => {
	Route.get('/page-slugs', 'ProjectController.getAvailableSlugs')
}).prefix('api/project')

Route.group(() => {
	Route.get('/index/:slug', 'ProjectController.show')
	Route.get('/index', 'ProjectController.index')
	Route.post('/create', 'ProjectController.store').validator('PorjectCreate')
	Route.patch('/update/:id', 'ProjectController.update').validator(
		'PorjectEdit'
	)
	Route.patch('/delete/:id', 'ProjectController.destroy')
	Route.get('/export/:id', 'ProjectController.export')
})
	.prefix('api/project')
	.middleware(['auth:jwt'])

Route.group(() => {
	Route.get('/html', 'PageController.getHTMLContent')
}).prefix('api/page')

Route.get('api/page/preview', 'PageController.preview')

// TODO: remove after aviso update
Route.group(() => {
	Route.post('/:pageid/revision', 'PageController.saveRevision')
	Route.post('/:pageid/revision/revert', 'PageController.revertRevision')
})
	.prefix('api/page')
	.middleware(['auth:jwt'])
/**
 * PAGES route
 */
Route.group(() => {
	Route.get('/index', 'PageController.index')
	Route.get('/:pageid', 'PageController.getPage')
	Route.post('/create', 'PageController.create').validator('PageCreate')
	Route.post('/:pageid/duplicate', 'PageController.duplicate')
	Route.patch('/:pageid/delete', 'PageController.delete')
	Route.post('/:pageid/revision', 'PageController.save')
	Route.get('/form/:service', 'PageController.formService')
	Route.get('/:pageid/preview', 'PageController.preview')
})
	.prefix('api/:project/page')
	.middleware(['auth:jwt', 'attach:project'])

Route.group(() => {
	Route.get('/html', 'PartialController.getHTMLContent')
}).prefix('api/partial')

/**
 * PARTIALS route
 */
Route.group(() => {
	Route.get('/index', 'PartialController.index')
	Route.get('/:partialid', 'PartialController.show')
	Route.post('/create', 'PartialController.create').validator('PartialCreate')
	Route.post('/:partialid', 'PartialController.update')
	Route.patch('/:partialid/delete', 'PartialController.delete')
})
	.prefix('api/partial')
	.middleware(['auth:jwt'])

/**
 * THEMES route
 */
Route.group(() => {
	Route.get('/index', 'ThemeController.systemIndex')
})
	.prefix('api/system-theme')
	.middleware(['auth:jwt'])

Route.group(() => {
	Route.get('/index', 'ThemeController.index')
	Route.get('/:theme_id', 'ThemeController.show')
	Route.post('/create', 'ThemeController.create')
	Route.post('/:theme_id', 'ThemeController.update')
	Route.patch('/:theme_id/delete', 'ThemeController.delete')
})
	.prefix('api/:project/theme')
	.middleware(['auth:jwt', 'attach:project'])

/**
 * TEMPLATES route
 */
Route.group(() => {
	Route.get('/index', 'TemplateController.index')
	Route.get('/:template_id', 'TemplateController.show')
	Route.post('/create', 'TemplateController.create')
	Route.post('/:template_id', 'TemplateController.update')
	Route.patch('/:template_id/delete', 'TemplateController.delete')
})
	.prefix('api/:project/template')
	.middleware(['auth:jwt', 'attach:project'])

/**
 * COLLECTIONS route
 */
Route.group(() => {
	Route.get('/index', 'CollectionController.index')
	Route.get('/:collection', 'CollectionController.show')
	Route.post('/create', 'CollectionController.create').validator(
		'CollectionCreate'
	)
	Route.post('/:collection', 'CollectionController.update')
	Route.patch('/:collection/delete', 'CollectionController.delete')
	Route.get('/form/:service', 'CollectionController.formService')
})
	.prefix('api/:project/collection')
	.middleware(['auth:jwt', 'attach:project'])

/**
 * ENTRIES route
 */

Route.group(() => {
	Route.get('/index', 'EntryController.index')
	Route.get('/sample', 'EntryController.sample')
	Route.get('/:entry_id', 'EntryController.show')
	Route.post('/create', 'EntryController.create')
	Route.post('/:entry_id', 'EntryController.update')
	Route.patch('/:entry_id/delete', 'EntryController.delete')
})
	.prefix('api/:project/:collection/entry')
	.middleware(['auth:jwt', 'attach:project', 'attach:collection'])

Route.get(
	'token-api/:project/:collection/entry/index',
	'EntryController.index'
).middleware(['auth:api', 'attach:project', 'attach:collection'])

Route.group(() => {
	Route.get('list', 'AssetLibraryController.list')
	Route.post('/upload', 'AssetLibraryController.upload')
})
	.prefix('api/asset-library')
	.middleware(['auth:jwt'])

Route.group(() => {
	Route.get('/list', 'ActivityController.list')
	Route.post('log', 'ActivityController.log')
})
	.prefix('api/activity')
	.middleware(['auth:jwt'])

Route.group(() => {
	Route.get('/:library', 'GenerateController.getModulesPublic')
	Route.get('/:library/handles', 'GenerateController.getModulesList')
}).prefix('api/modules/lib/')

Route.group(() => {
	Route.get('/:library', 'GenerateController.getGroups')
}).prefix('api/groups/lib/')

Route.group(() => {
	Route.get('/:library', 'GenerateController.getGroupsAuth')
})
	.prefix('api/groupsauth/lib/')
	.middleware(['auth:jwt'])

Route.group(() => {
	Route.get('/:group', 'GenerateController.getModulesbyGroup')
}).prefix('api/modules/group/')

Route.group(() => {
	Route.get('/index', 'GenerateController.getModules')
	Route.get('/:handle', 'GenerateController.getModule')
	Route.post('/:handle/gethtml', 'GenerateController.getHTML')
	Route.post('/getpage', 'GenerateController.getHTML')
})
	.prefix('api/modules')
	.middleware(['auth:jwt'])

Route.get('/demo/:proj/:page', 'DemoController.renderPage')

Route.post('/gethtml', 'GenerateController.getHTML')
	.validator('GetHtml')
	.middleware(['auth:api'])

// Have client render the email urls:
Route.get('/confirm-email?token=', 'AuthController.confirmEmailRender').as(
	'confirm'
)
Route.get('/reset-password?token=', 'AuthController.resetPasswordForm').as(
	'password.reset'
)

Route.group(() => {
	Route.get('/me', 'AuthController.me')
	Route.get('/profile', 'AuthController.profile')
	Route.get('/generate-token', 'AuthController.generateToken')
	Route.get('/revoke-token', 'AuthController.revokeToken')
	Route.get('/tokens', 'AuthController.listTokens')
	// Route.get('/update-token', 'AuthController.updateToken')
	// Route.get('/tokens', 'AuthController.listTokens')
	Route.put('/update-profile', 'AuthController.updateProfile')
	Route.get('logout', 'AuthController.logout').as('logout')
})
	.prefix('api/auth')
	.middleware(['auth:jwt'])

// 404 page not found
Route.any('*', 'NuxtController.render')

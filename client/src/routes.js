import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import {GalleryPage} from './pages/GalleryPage'
import {GalleryItemPage} from './pages/GalleryItemPage'

import {SliderPage} from './pages/SliderPage'

import {TeamPage} from './pages/TeamPage'

import {GalleryCreatePage} from './pages/admin/gallery/CreatePage'
import {AdminGalleryPage} from './pages/admin/gallery/Page'
import {AdminGalleryItemPage} from './pages/admin/gallery/ItemPage'
import {AdminGalleryEditPage} from './pages/admin/gallery/EditPage'

import {AdminSliderPage} from './pages/admin/slider/Page'
import {AdminSliderEditPage} from './pages/admin/slider/EditPage'

import {AdminTeamPage} from './pages/admin/team/Page'
import {AdminTeamEditPage} from './pages/admin/team/EditPage'

import {AdminPage} from './pages/admin/AdminPage'
import {AuthPage} from './pages/AuthPage'
import {RegisterPage} from './pages/RegisterPage'

export const useRoutes = isAuntethicated => {

	if (isAuntethicated) {
		return(
			<Switch>
				<Route path="/admin" exact>
					<AdminPage />
				</Route>

				<Route path="/admin_gallery_add" exact>
					<GalleryCreatePage />
				</Route>
				<Route path="/admin_gallery" exact>
					<AdminGalleryPage />
				</Route>
				<Route path="/admin_edit_gallery/:id">
					<AdminGalleryEditPage />
				</Route>
				<Route path="/admin_gallery/:id">
					<AdminGalleryItemPage />
				</Route>

				<Route path="/admin_slider" exact>
					<AdminSliderPage />
				</Route>
				<Route path="/admin_edit_slider/:id">
					<AdminSliderEditPage />
				</Route>

				<Route path="/admin_team" exact>
					<AdminTeamPage />
				</Route>
				<Route path="/admin_edit_team/:id">
					<AdminTeamEditPage />
				</Route>

				<Redirect to="/admin" />
			</Switch>
		)
	}

	return (
		<Switch>
			<Route path="/login" exact>
				<AuthPage />
			</Route>
			<Route path="/register" exact>
				<RegisterPage />
			</Route>
			<Route path="/" exact>
				<GalleryPage />
			</Route>
			<Route path="/gallery/:id">
				<GalleryItemPage />
			</Route>
			<Route path="/slider" exact>
				<SliderPage />
			</Route>
			<Route path="/team" exact>
				<TeamPage />
			</Route>
			<Redirect to="/" />
		</Switch>
	)

}
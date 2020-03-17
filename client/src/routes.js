import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import {GalleryCreatePage} from './pages/GalleryCreatePage'
import {GalleryPage} from './pages/GalleryPage'
import {GalleryItemPage} from './pages/GalleryItemPage'
import {AdminPage} from './pages/AdminPage'
import {AuthPage} from './pages/AuthPage'
import {RegisterPage} from './pages/RegisterPage'

export const useRoutes = isAuntethicated => {

	if (isAuntethicated) {
		return(
			<Switch>
				<Route path="/gallery_add" exact>
					<GalleryCreatePage />
				</Route>
				<Route path="/admin" exact>
					<AdminPage />
				</Route>
				<Route path="/admin_gallery" exact>
					<GalleryPage />
				</Route>
				<Route path="/admin_gallery/:id">
					<GalleryItemPage />
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
			<Redirect to="/" />
		</Switch>
	)

}
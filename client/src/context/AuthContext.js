import {createContext} from 'react'

function boo() {}

export const AuthContext = createContext({
	token: null,
	userId: null,
	username: null,
	login: boo,
	logout: boo,
	isAuthenticated: false
})
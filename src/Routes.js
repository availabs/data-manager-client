
// --- Public Pages ------
import Test from 'pages/Test';
import MyBlog from 'pages/blog-it-up'
import DmsDocs from "components/dms/docs"

import MapTest from "pages/map-test"

// import Blog from 'pages/Blog'
// import Docs from 'pages/Docs'
// import DocsView from 'pages/Docs/view'
//
// import BlogPublic from 'pages/Blog/Landing'

import NoMatch from 'pages/404';
// import Login from "pages/Login"
// import Logout from "pages/Logout"

// import Home from "pages/home"

import Auth from "pages/auth"

// import WebTest from "pages/web-test"

import GraphTest from "pages/Test/graph"

export default [
	// -- public
	// BlogPublic,
	// Blog,
	// Docs,
	// DocsView,

	// ...WebTest,

	MyBlog,
	DmsDocs,
	GraphTest,
	...Test,

	...MapTest,

	// ConfigSimple,
	// Login,
	// Logout,
	// Home,

	Auth,

	// -- util
	NoMatch
];

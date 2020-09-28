
// --- Public Pages ------
import Test from 'pages/Test';

import MyBlog from 'pages/blog-it-up'

import Blog from 'pages/Blog'
import Docs from 'pages/Docs'
import DocsView from 'pages/Docs/view'

import BlogPublic from 'pages/Blog/Landing'

import NoMatch from 'pages/404';
import Login from "pages/Login"
import Logout from "pages/Logout"
import Home from "pages/home"

import DmsDocs from "components/DMS/docs"

import Auth from "components/AMS/test_config"

export default [
	// -- public
	BlogPublic,
	Blog,
	Docs,
	DocsView,
	MyBlog,
	DmsDocs,
	// ConfigSimple,
	...Test,
	Login,
	Logout,
	Home,

	Auth,

	// -- util
	NoMatch
];

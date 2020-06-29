
// --- Public Pages ------
import Test from 'pages/Test';

import MyBlog from 'pages/blog-it-up'

import DocsEditor from 'pages/DocsEditor'

import NoMatch from 'pages/404';
import Login from "pages/Login"
import Logout from "pages/Logout"
import Home from "pages/home"

import DmsDocs from "components/DMS/docs"

export default [
	// -- public
	DocsEditor,
	MyBlog,
	DmsDocs,
	// ConfigSimple,
	...Test,
	Login,
	Logout,
	Home,
	// -- util
	NoMatch
];

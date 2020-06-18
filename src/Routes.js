
// --- Public Pages ------
import Test from 'pages/Test';

import MyBlog from 'pages/blog-it-up'
import TestWrapper from "pages/TestWrapper"

import DocsEditor from 'pages/DocsEditor'

import NoMatch from 'pages/404';
import Login from "pages/Login"

import DmsDocs from "components/DMS/docs"

export default [
	// -- public
	DocsEditor,
	MyBlog,
	DmsDocs,
	TestWrapper,
	// ConfigSimple,
	Test,
	Login,
	// -- util
	NoMatch
];

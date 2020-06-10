
// --- Public Pages ------
import Test from 'pages/Test';
import ConfigOnly from 'pages/ConfigOnly'
import ConfigSimple from 'pages/ConfigOnly/simple'
import NoMatch from 'pages/404';
import Login from "pages/Login"

import DmsDocs from "components/DMS/docs"

export default [
	// -- public
	...ConfigOnly,
	DmsDocs,
	// ConfigSimple,
	Test,
	Login,
	// -- util
	NoMatch
];

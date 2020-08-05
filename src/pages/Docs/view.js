import { /*docsPage, docsSection,*/ npmrdsDoc } from './docs.type'
//import SectionManager from './components/SectionManager'
//import PageEdit from './components/PageEdit'
import PageView from './components/PageView'



let config = {
  type: "dms-manager", // top level component for managing data items
  wrappers: [
    "dms-provider",
    "dms-falcor",
  ],
  props: {
    format: npmrdsDoc,
    title: " ",
    className: 'h-full',
    noHeader: true
  },
  children: [
    PageView
  ]
}

export default {
  path: "/documentation",
  mainNav: true,
  // exact: true,
  auth: true,
  name: 'Docs View',
  icon: '',
  layoutSettings: {
    fixed: true,
    nav: 'side',
    maxWidth: '',
    headerBar: false,
    theme: 'flat'
  },
  component: config
}

const AuthConfig = {
  type: "ams-manager",
  wrappers: [
    "ams-redux",
    "ams-router"
  ],
  children: [
    { type: "ams-login" },
    { type: "ams-logout",
// @props.redirectTo
// Optional prop. Defaults to "/".
// Redirects user to URL after logging out.
      // props: { redirectTo: "/" }
    },
    { type: "ams-profile" },
    { type: "ams-signup",
// @props.addToGroup
// Optional prop. Defaults to false.
// Adds user to group (must have auth level 0 in all projects) instead of creating a request that must be accepted by admin.
      props: { addToGroup: "123" }
    },
    { type: "ams-verify-request" },
    { type: "ams-verify-email" },
    { type: "ams-reset-password" },
    { type: "ams-project-management",
// @props.authLevel
// Optional prop. This prop can be applied to any AMS child.
// If set, users must have equal or higher authLevel to view this page.
      props: { authLevel: 5 }
    }
  ]
}

export default {
  path: "/auth",
  mainNav: false,
  // exact: true,
  // auth: true,
  layoutSettings: {
    fixed: true,
    nav: 'side',
    headerBar: false,
    theme: 'TEST_THEME'
  },
  component: AuthConfig
}

import format from "./docs.format.js"

const config = {
  type: "dms-manager",
  wrappers: [
    "show-loading",
    "dms-provider",
    "dms-router",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format
  },
  children: [
    { type: "dms-table",
      props: {
        dmsAction: "list",
        columns: ["title", "dms:edit"]
      }
    },
    { type: "dms-create",
      props: { dmsAction: "create" }
    },
    { type: "dms-edit",
      props: { dmsAction: "edit" }
    }
  ]
}
export default config;

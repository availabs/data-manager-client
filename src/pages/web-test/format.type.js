const section = {
  app: "avl-website",
  type: "section",

  attributes: [
    { key: "section",
      type: "text",
      required: true
    },
    { key: "content",
      type: "richtext",
      required: true
    }
  ]
}

const format = {
  app: "avl-website",
  type: "page",

  registerFormats: [section],

  attributes: [
    { key: "page",
      type: "text",
      required: true
    },
    { key: "index",
      type: "number",
      default: "props:index",
      editable: false
      // hidden: true
    },
    { key: "sections",
      type: "dms-format",
      format: "avl-website+section",
      fullWidth: true,
      isArray: true
    }
  ]
}
export default format;

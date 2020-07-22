export default {
  app: "npmrds",
  type: "doc-page",
  attributes: [
    { key: "section",
      type: "text",
      required: true,
      default: "props:section"
    },
    { key: "index",
      type: "number",
    },
    { key: "page",
      type: "number"
    },
    { key: "content",
      type: "richtext"
    },
    { key: "tags",
      type: "text",
      isArray: true
    }
  ]
}

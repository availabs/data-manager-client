

export const doc = {
  app: "docs",
  type: "page",
  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    { key: "body",
      type: "textarea",
      required: true
    },
    { key: "bloggerId",
      name: "Blogger ID",
      type: "text",
      default: "from:user.id", // default value will be pulled from props.user.id
      editable: false
    }
  ]
}

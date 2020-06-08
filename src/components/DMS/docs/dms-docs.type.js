export const DMS_DOCS = {
  app: "dms",
  type: "dmcs-docs",
  attributes: [
    { key: "title",
      name: "Title",
      type: "text",
      required: true
    },
    { key: "body",
      name: "Body",
      type: "textarea",
      required: true
    },
    { key: 'tags',
      name: "Tags",
      type: 'array:text'
    }
  ]
}

export const DMS_DOCS = {
  app: "dms",
  type: "dms-docs",
  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    { key: "body",
      type: "textarea",
      required: true
    },
    { key: "test",
      type: "rich-text"
    },
    { key: "chapter",
      type: "text",
      required: true
    },
    { key: 'tags',
      type: 'text-array'
    }
  ]
}

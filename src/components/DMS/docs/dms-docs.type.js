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
      required: true,
      verify: ["^\\d+([.]\\d+)*$"]
    },
    { key: "test2",
      type: "number",
      min: 0,
      max: 10
    },
    { key: 'tags',
      type: 'text-array'
    }
  ]
}

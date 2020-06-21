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
    { key: "chapter",
      type: "text",
      required: true,
      verify: "^\\d+([.]\\d+)*$"
    },
    { key: 'tags',
      type: 'text-array'
    },


    { key: "test-editor",
      type: "rich-text"
    },
    { key: "test-number-array",
      type: "number-array",
      min: 0,
      max: 10
    },
    { key: "test-number",
      type: "number",
      min: 0,
      max: 10
    },
    { key: "test-date-array",
      type: 'date-array'
    },
    { key: 'test-select',
      type: "text",
      searchable: false,
      domain: "from:domain"
    },
    { key: 'test-multi-select',
      type: "text-array",
      domain: "from:domain"
    },
    { key: "test-image",
      type: "img"
    }
  ]
}

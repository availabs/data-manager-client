const TestFormat1 = {
  app: "dms",
  type: "dms-test-1",
  attributes: [
    { key: "test-1-1",
      type: "text",
      required: true
    },
    { key: "test-1-2",
      type: "text"
    },
    { key: "test-1-3",
      type: "number"
    },
    { key: "test-1-4",
      type: "dms-format:dms+dms-test-2",
      // required: false
    }
  ]
}
const TestFormat2 = {
  app: "dms",
  type: "dms-test-2",
  attributes: [
    { key: "test-2-1",
      type: "text"
    },
    { key: "test-2-2",
      type: "date",
      required: true
    },
    { key: "test-2-3",
      type: "text-array"
    },
    { key: "test-2-4",
      type: "text",
      required: true
    }
  ]
}

export default {
  app: "dms",
  type: "dms-docs",

  registerFormats: [TestFormat1, TestFormat2],

  sections: [
    { title: "Test Page",
      attributes: [
        { key: "test-format",
          type: "dms-format:dms+dms-test-1",
          // required: true
        }
      ]
    },
    { title: "Main Page",
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
        }
      ]
    },
    { title: "Editor Page",
      attributes: [
        { key: "text-editor",
          type: "richtext"
        }
      ]
    },
    { title: "Numbers Page",
      attributes: [
        { key: "test-number",
          type: "number"
        },
        { key: "test-number-array",
          type: "number-array"
        }
      ]
    },
    { title: "Random Page",
      attributes: [
        { key: "test-date-array",
          type: 'date-array'
        },
        { key: 'test-select',
          type: "text",
          searchable: false,
          domain: "props:domain"
        },
        { key: 'test-multi-select',
          type: "text-array",
          domain: "props:domain"
        }
      ]
    },
    { title: "Image Page",
      attributes: [
        { key: "test-image",
          type: "img"
        }
      ]
    }
  ]
}

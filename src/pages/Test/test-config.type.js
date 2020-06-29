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
      type: "text",
      isArray: true
    },
    { key: "test-2-4",
      type: "text",
      required: true
    }
  ]
}

export default {
  app: "dms",
  type: "dms-test",

  registerFormats: [TestFormat1, TestFormat2],

  sections: [
    { title: "Editor Page",
      attributes: [
        { key: "text-editor",
          type: "richtext"
        }
      ]
    },
    { title: "Image Page",
      attributes: [
        { key: "test-image",
          type: "img"
        }
      ]
    },
    { title: "Info Page",
      attributes: [
        { key: "title",
          type: "text",
          required: true
        },
        { key: "creator",
          type: "text",
          default: "props:user.id",
          editable: false
        }
      ]
    },
    { title: "Random Page",
      attributes: [
        { key: "test-date-array",
          type: 'date',
          isArray: true
        },
        { key: "test-object-input",
          type: "object"
        },
        { key: 'test-multi-select',
          type: "text",
          isArray: true,
          domain: "props:domain"
        },
        { key: 'test-select',
          type: "text",
          searchable: false,
          domain: "props:domain"
        },
      ]
    },
    { title: "Format Page",
      attributes: [
        { key: "test-format",
          type: "dms-format:dms+dms-test-1",
          // required: true
        }
      ]
    },
    { title: "Numbers Page",
      attributes: [
        { key: "test-number",
          type: "number"
        },
        { key: "test-number-array",
          type: "number",
          isArray: true
        }
      ]
    },
  ]
}

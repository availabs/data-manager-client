export default {
  app: "dms",
  type: "dms-docs",

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

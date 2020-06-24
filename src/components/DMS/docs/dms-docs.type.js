import { processFormat } from "../utils"

const DMS_DOCS = {
  app: "dms",
  type: "dms-docs",

  sections: [
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
      sections: [
        { title: "TEST 1",
          attributes: [
            { key: "test 1.1",
              type: "text"
            },
            { key: "test 1.2",
              type: "text"
            },
            { key: "test 1.3",
              type: "text"
            }
          ]
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

export default processFormat(DMS_DOCS)

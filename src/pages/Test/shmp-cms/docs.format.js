


const pageSection = {
    app: "shmp",
    type: "page-section",
    attributes: [
        { key: "title",
            type: "text"
        },
        { key: "content",
            type: "richtext",
            required: true
        },
        {
          key: 'section',
          type: "text"
        }
    ]
}

const shmpDoc = {
  app: "shmp",
  type: "doc-page",
  registerFormats: [pageSection],
  attributes: [
    { key: "section",
      type: "text",
      required: true,
      default: "props:section",
      hidden: true
    },
    { key: "sectionLanding",
      type: "boolean",
      default: false,
      editable: false,
      hidden: true
    },
    { key: "index",
      type: "number",
      default: "props:index",
      editable: false,
      hidden: true
    },
    { key: "title",
      type: "text"
    },
    {
      key: 'url-slug',
      type: "text"
    },
    {
      key: 'showSidebar',
      type: "boolean",
      default: true,
      required: true
    },
    {
      key: 'sections',
      type: "dms-format",
      format: "shmp+page-section",
      isArray: true,
      useOrdered: true,
      editInPlace: true,
    }
  ]
}

export default shmpDoc

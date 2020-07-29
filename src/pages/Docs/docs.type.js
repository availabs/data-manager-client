
const npmrdsDoc = {
  app: "npmrds",
  type: "doc-page",
  attributes: [
    { key: "section",
      type: "text",
      required: true,
      default: "props:section",
      //hidden: true
    },
    { key: "sectionLanding",
      type: "number",
      required: true,
      hidden: true,
      //default: 0
    },
    { key: "index",
      type: "number",
      hidden: true
    },
    { key: "page",
      type: "number"
    },
    { key: "title",
      type: "text"
    },
    { key: "content",
      type: "richtext"
    },
    { key: "tags",
      type: "text",
      isArray: true
    }
  ]
}


export {
  npmrdsDoc
}

/*const docsPage = {
  app: "docs2",
  type: "page",
  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    {
      key:"index",
      type: "number", 
    },
    { key: "body",
      type: "richtext",
      required: true
    },
    { key: "tags",
      name: "tags",
      type: "text",
      isArray: true
    }
  ]
}

const docsSection = {
  app: "docs2",
  type: "section",
  registerFormats: [docsPage],
  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    {
      key:"index",
      type: "number", 
    },
    { key: "pages",
      type: "dms-format",
      format: "docs2+page",
      fullWidth: true,
      isArray: true
    },
    
  ]
}
*/
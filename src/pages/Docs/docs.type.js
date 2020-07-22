const docsPage = {
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
      type: "docsPage",
      isArray: true
    },
    
  ]
}

export {
  docsPage,
  docsSection
}
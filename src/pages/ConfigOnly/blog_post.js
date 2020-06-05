export const BLOG_POST = {
  app: "my-blog",
  type: "blog-post",
  attributes: [
    { key: "title",
      name: "Title",
      type: "text",
      required: true
    },
    { key: "body",
      name: "Body",
      type: "textarea",
      required: true
    },
    { key: 'tags',
      type: 'array:text'
    },
    { key: "bloggerId",
      name: "Blogger ID",
      type: "text",
      default: "from:user.id", // default value will be pulled from props.user.id
      editable: false
    },
    { key: "replyTo",
      type: "text",
      default: "from:blog-post.id", // default value will be pulled from props.blog-post.id
      editable: false
    }
  ]
}

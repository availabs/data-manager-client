export const BLOG_POST = {
  app: "my-blog",
  type: "blog-post",
  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    { key: "body",
      type: "textarea",
      required: true
    },
    { key: 'tags',
      type: 'text-array'
    },
    { key: "bloggerId",
      name: "Blogger ID",
      type: "text",
      default: "props:user.id", // default value will be pulled from props.user.id
      editable: false
    },
    { key: "replyTo",
      name: "Reply To",
      type: "text",
      default: "props:blog-post.id", // default value will be pulled from props.blog-post.id
      editable: false
    }
  ]
}

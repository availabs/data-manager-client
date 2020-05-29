export const blogPost = {
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

export const blogs = [
  { id: "blog-1", app: "my-blog", type: "blog-post",
    data: {
      title: "Test 1",
      body: "Test blog 1",
      tags: null,
      bloggerId: "fake-user-id",
      replyTo: null
    }
  },
  { id: "blog-2", app: "my-blog", type: "blog-post",
    data: {
      title: "Test 2",
      body: "Test blog 2",
      tags: null,
      bloggerId: 123,
      replyTo: null
    }
  },
  { id: "blog-3", app: "my-blog", type: "blog-post",
    data: {
      title: "reply 2-1",
      body: "Reply 1 to test blog 2",
      tags: null,
      bloggerId: 456,
      replyTo: "blog-2"
    }
  },
  { id: "blog-4", app: "my-blog", type: "blog-post",
    data: {
      title: "Reply 2-2",
      body: "Reply 2 to test blog 2",
      tags: null,
      bloggerId: 789,
      replyTo: "blog-2"
    }
  }
]

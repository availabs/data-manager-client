import React from "react"

import { useTheme } from "@availabs/avl-components"

import { DmsButton } from "components/dms/components/dms-button"

const BlogPost = ({ item, dataItems, startOpened = true, ...props }) => {
  const [opened, setOpened] = React.useState(startOpened);

  const theme = useTheme();

  if (!item) return null;

  const replies = dataItems.filter(i => +i.data.replyTo === +item.id);

  return (
    <div className={ `
      px-3 pt-3 mb-3 rounded-md shadow-md
      ${ theme.menuBg }
      ${ opened && replies.length ? "pb-0" : "pb-3" }
    ` }>
      <div className="text-xl font-bold">{ item.data.title }</div>
      <div className="flex">
        <div className="flex-0">
          Blogger: { item.data.bloggerId }
        </div>
        <div className="flex-1 flex justify-end">
          ({ item.id }) { item.updated_at }
        </div>
      </div>
      <div className={ `p-4 rounded ${ theme.bg }` }>
        { item.data.body }
      </div>
      <div className="relative flex items-center pt-2">
        <DmsButton action="dms:reply" item={ item }/>
        { !replies.length ? null :
          <div className="flex flex-1 justify-end">
            <div className={ `
              flex-0 w-6 h-6 rounded cursor-pointer
              flex justify-center items-center
            ` } onClick={ e => setOpened(!opened) }>
              <span className={ `fas fa-${ opened ? "minus" : "plus" }` }/>
            </div>
          </div>
        }
      </div>
      { !replies.length || !opened ? null :
        <div className="pl-16 mt-2 relative">
          { !opened ? null :
            replies.map(r =>
              <BlogPost key={ r.id } item={ r } dataItems={ dataItems } { ...props } startOpened={ false }/>
            )
          }
        </div>
      }
    </div>
  )
}

export default BlogPost;

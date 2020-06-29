import React from "react"

import { Button } from "components/avl-components/components/Button"

import get from "lodash.get"

import { useTheme } from "components/avl-components/wrappers/with-theme"
import imgLoader from "components/avl-components/wrappers/img-loader"
import showLoading from "components/avl-components/wrappers/show-loading"

import * as d3brush from "d3-brush"
import * as d3selection from "d3-selection"

const d3 = {
  ...d3brush,
  ...d3selection
}

const getInitialState = type => ({
  group: null,
  brush: d3[type](),
  Brush: () => null,
  width: 0,
  height: 0,
  selection: null
})
const reducer = (state, action) => ({ ...state, ...action });

const useBrush = (node, type = "brush") => {
  const [{
    group,
    brush,
    Brush,
    width,
    height,
    selection
  }, dispatch] = React.useReducer(reducer, type, getInitialState);

  React.useEffect(() => {
    const setGroup = n => dispatch({ group: n });
    dispatch({
      Brush: React.memo(() => <g ref={ setGroup }/>)
    })
  }, []);

  React.useEffect(() => {
    if (node && group) {
      const brushEnd = e =>
        dispatch({ selection: group ? d3.brushSelection(group) : null });
      d3.select(group).call(brush.on("end", brushEnd, 50));
    }
    else if (width && height) {
      dispatch({ selection: null });
      dispatch({ width: 0, height: 0 });
    }
    return () => brush.on("end", null);
  }, [node, group, brush, width, height]);

  if (node) {
    const rect = node.getBoundingClientRect();
    if ((rect.width !== width) || (rect.height !== height)) {
      dispatch({ width: rect.width, height: rect.height });
      brush.extent([[0, 0], [rect.width, rect.height]]);
    }
  }
  React.useEffect(() => {
    if (node) {
      const rect = node.getBoundingClientRect();
      if ((rect.width !== width) || (rect.height !== height)) {
        dispatch({ width: rect.width, height: rect.height });
        brush.extent([[0, 0], [rect.width, rect.height]]);
      }
    }
  }, [node, brush, width, height]);

  return {
    Brush,
    selection,
    clear: () => brush.clear(d3.select(group))
  }
}

const ImgInput = ({ height = 500, autoFocus = false, ...props }) => {
  const [draggingOver, setDragging] = React.useState(false);

  const dragOver = e => {
    stopIt(e);

    setDragging(true);
  }
  const onDragExit = e => {
    stopIt(e);

    setDragging(false);
  }
  const stopIt = e => {
    e.preventDefault();
    e.stopPropagation();
  }
  const uploadImage = file => {
    const url = `http://localhost:4444/img/new/upload/${ file.name }`;

    props.uploadImage(file, url)
      .then(props.onChange);
  }
  const dropIt = e => {
    e.preventDefault();
    e.stopPropagation();

    if (props.disabled) return;

    setDragging(false);

    const file = get(e, ["dataTransfer", "files", 0], null);
    file && uploadImage(file);
  }
  const handleChange = e => {
    e.preventDefault();
    e.stopPropagation();

    if (props.disabled) return;

    const file = get(e, ["target", "files", 0], null);
    file && uploadImage(file);
  }

  const [img, setImg] = React.useState(null),
    [, setLoaded] = React.useState(false);

  const [svg, setSvg] = React.useState(null)
  const {
    Brush,
    selection,
    clear
  } = useBrush(svg);

  const [savedSrc, saveSrc] = React.useState(props.value);
  const hasSource = Boolean(props.value);
  React.useEffect(() => {
    !savedSrc && saveSrc(props.value);
  }, [savedSrc, hasSource, props.value]);

  const applyCrop = e => {

    const { naturalHeight } = img,
      { height } = svg.getBoundingClientRect(),
      scale = naturalHeight / height;

    const [[x1, y1], [x2, y2]] = selection.map(d => d.map(dd => dd * scale)),
      regex = /^https?.+[/](.+[.].+)$/,
      match = regex.exec(props.value);

    if (match) {
      const [, filename] = match;

      const url = `http://localhost:4444/img/new/process/cropped_${filename}/crop/${x2-x1},${y2-y1},${x1},${y1}`;

      props.processImage(props.value, url)
        .then(props.onChange)
        .then(clear);
    }
  }
  const undoCrop = e => {
    props.onChange(savedSrc);
    saveSrc(null);
  }

  const [hasFocus, setFocus] = React.useState(autoFocus),
    [ref, setRef] = React.useState(null);
  React.useEffect(() => {
    autoFocus && ref && ref.focus();
  }, [autoFocus, ref]);

  const theme = useTheme();

  return (
    <div className={ `
        w-full ${ hasFocus ? theme.inputBorderFocus : theme.inputBorder  } rounded p-2 relative
      ` } tabIndex="0" ref={ setRef } onClick={ e => ref.focus() }
      onFocus={ e => setFocus(true) }
      onBlur={ e => setFocus(false) }>
      <div className={ `
          border-2 border-dashed rounded p-2 ${ theme.inputBg }
          ${ draggingOver ? "border-gray-500" : "" }
        ` }
        onDragOver={ e => !props.disabled && dragOver(e) }
        onDragLeave={ e => !props.disabled && onDragExit(e) }
        onDrop={ e => dropIt(e) }>

        <div className="relative flex items-center justify-center w-full" style={ { height: `${ height }px` } }>

          { props.value ?
              <div className="flex-1 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center hoverable">
                <div className="relative" style={ { maxHeight: `${ height }px` } }>
                  <div className="z-0 h-full" style={ { maxHeight: `${ height }px` } }>
                    <img src={ props.value } alt={ props.value  } ref={ setImg }
                      className="inline h-full" style={ { maxHeight: `${ height }px` } }
                      onLoad={ e => setLoaded(true) }/>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full z-10"
                    style={ { maxHeight: `${ height }px` } }>
                    <svg className="w-full h-full" ref={ setSvg }>
                      { <Brush /> }
                    </svg>
                  </div>
                </div>
                <div className={ `
                    absolute right-0 top-0 z-10 show-on-hover
                    rounded bg-red-500 p-1 cursor-pointer
                  ` }
                  onClick={ e => { saveSrc(null); props.onChange(null); } }>
                  <svg width="20" height="20">
                    <line x2="20" y2="20" style={ { stroke: "#fff", strokeWidth: 4 } }/>
                    <line y1="20" x2="20" style={ { stroke: "#fff", strokeWidth: 4 } }/>
                  </svg>
                </div>
              </div>
            : draggingOver ?
              <span className="far fa-image fa-9x pointer-events-none opacity-50"/>
            : props.disabled ?
              <span className="fas fa-times fa-9x pointer-events-none opacity-50"/>
            :
              <div className="flex-0 flex flex-col items-center">
                <LabelButton id={ props.id } onChange={ e => handleChange(e) }/>
                <div className="mt-1">...or drag and drop.</div>
                <div className="mt-1">{ props.message }</div>
              </div>
          }

        </div>

      </div>
      <div className={ `mt-2 p-2 border-2 rounded ${ theme.accent1 } flex` }>
        <div className="flex-1 btn-group-horizontal">
          <Button disabled={ !Boolean(selection) } onClick={ e => applyCrop(e) } tabIndex="-1">
            Apply Crop
          </Button>
          <Button disabled={ savedSrc === props.value } onClick={ e => undoCrop(e) } tabIndex="-1">
            Undo Crop
          </Button>
        </div>
        <div className="flex-0 flex justify-end">
          <Button disabled={ true } buttonTheme="buttonSuccess">
            Save Image
          </Button>
        </div>
      </div>
      { props.children }
    </div>
  )
}
const LoadingOptions = {
  position: "absolute",
  className: "rounded"
}
export default imgLoader(showLoading(ImgInput, LoadingOptions));
const LabelButton = props => {
  const theme = useTheme();
  return (
    <div>
      <label htmlFor={ props.id } className={ `${ theme.buttonInfo } cursor-pointer` }>
        Select an image file...
      </label>
      <input className="py-1 px-2 w-full rounded hidden" tabIndex="-1"
        type="file" accept="image/*" { ...props }/>
    </div>
  )
}

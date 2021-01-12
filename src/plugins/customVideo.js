import { Quill } from 'vue-quill-editor'

const BlockEmbed = Quill.import('blots/block/embed')

class VideoBlot extends BlockEmbed {
  static create (value) {
    const node = super.create(value)
    node.setAttribute('class', `${value.className || ''}`)
    node.setAttribute('src', value.url)
    node.setAttribute('controls', value.controls)
    node.setAttribute('poster', value.poster)
    // node.setAttribute('preload', 'none')
    // node.setAttribute('width', value.width)
    // node.setAttribute('height', value.height)
    return node
  }

  static value(node) {
    return {
      class: node.getAttribute('class'),
      url: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      poster: node.getAttribute('poster'),
      // preload: node.getAttribute('preload'),
      // width: node.getAttribute('width'),
      // height: node.getAttribute('height')
    };
  }
}
VideoBlot.blotName = 'customVideo'
VideoBlot.className = 'ql-video'
VideoBlot.tagName = 'video'

export default VideoBlot
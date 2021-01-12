import { Quill } from 'vue-quill-editor'

const BlockEmbed = Quill.import('blots/block/embed')

class AudioBlot extends BlockEmbed {
  static create (value) {
    const node = super.create(value)
    node.setAttribute('class', 'audio')
    node.setAttribute('src', value.url)
    node.setAttribute('controls', value.controls)
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
      // preload: node.getAttribute('preload'),
      // width: node.getAttribute('width'),
      // height: node.getAttribute('height')
    };
  }
}
AudioBlot.blotName = 'customAudio'
AudioBlot.className = 'ql-audio'
AudioBlot.tagName = 'audio'

export default AudioBlot
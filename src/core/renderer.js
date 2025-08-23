export class Renderer {
  constructor({ iframe, eventBus, registry }) {
    this.iframe = iframe; this.events = eventBus; this.registry = registry;
    this._setupIframe();
  }

  _setupIframe() {
    this.iframe.onload = () => {
      const doc = this.iframe.contentDocument;
      const tpl = document.getElementById('iframe-css');
      doc.open();
      doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8">${tpl.innerHTML}</head><body><div id="canvas-content"></div></body></html>`);
      doc.close();
      this.events.emit('iframe:ready');
    };
    this.iframe.src = 'about:blank';
  }

  render(elements) {
    const doc = this.iframe.contentDocument; if (!doc) return;
    let root = doc.getElementById('canvas-content');
    if (!root) {
      const el = doc.createElement('div')
      el.id = 'canvas-content';
      doc.body.appendChild(el);
      root = el;
    };
    root.innerHTML = elements.map(el => this._renderElement(el)).join('');
    this.events.emit('render:done');
  }

  _renderElement(node) {
    const def = this.registry.get(node.type);
    if (!def) return `<div class="element">Unknown ${node.type}</div>`;
    return def.render(node, { renderChild: (child) => this._renderElement(child) });
  }
}
import { EventBus } from "./events.js";
import { State } from "./state.js";
import { Renderer } from "./renderer.js";
import { Overlay } from "./overlay.js";
import { Registry } from "./registry.js";

import { uid } from "./utils.js";

export class Editor {
  constructor({ iframe, overlay, propertiesRoot }) {
    this.registry = new Registry();
    this.events = new EventBus();
    this.state = new State();

    this.renderer = new Renderer({
      iframe,
      eventBus: this.events,
      registry: this.registry,
    });
    this.overlay = new Overlay({
      overlayRoot: overlay,
      iframe,
      eventBus: this.events,
    });

    this._wire();
  }

  _wire() {
    this.events.on("overlay:select", (id) => {
      this.select(id);
    });

    // dragging new components
    this.events.on("dnd:add", ({ type, insertBefore, parentId }) => {
      this.addElement({ type, props: {}, insertBefore, parentId });
    });

    // moving existing
    this.events.on("dnd:move", ({ id, insertBefore, parentId }) => {
      console.log("dnd:move", { id, insertBefore, parentId });

      const moved = this._removeById(id);
      if (!moved) return;

      this._insertNode(moved, { insertBefore, parentId });
      this._commit();
      this.select(id);
    });
  }

  registerPlugin(plugin) {
    // plugin: { elements: [defs], setup?(editor){...} }
    plugin.elements.forEach((def) => this.registry.register(def));
    plugin.setup?.(this);
  }

  addElement({ type, props = {}, insertBefore = null, parentId = null }) {
    const def = this.registry.get(type);
    if (!def) throw new Error(`Unknown type ${type}`);
    const node = {
      id: uid("el"),
      type,
      props: { ...def.defaults, ...props },
      children: def.canHaveChildren ? [] : undefined,
    };
    this._insertNode(node, { insertBefore, parentId });
    this._commit();
    this.select(node.id);
    return node.id;
  }

  _insertNode(node, { insertBefore, parentId }) {
    if (parentId) {
      const p = this.state.findById(parentId);
      if (!p) return;
      p.children = p.children || [];
      if (insertBefore) {
        const idx = p.children.findIndex((n) => n.id === insertBefore);
        p.children.splice(Math.max(idx, 0), 0, node);
      } else {
        p.children.push(node);
      }
    } else {
      if (insertBefore) {
        const idx = this.state.elements.findIndex((n) => n.id === insertBefore);
        this.state.elements.splice(Math.max(idx, 0), 0, node);
      } else {
        this.state.elements.push(node);
      }
    }
  }

  _removeById(id) {
    return this.state.removeById(id);
  }

  _commit() {
    this.renderer.render(this.state.elements);
    this.overlay.sync();
    this.events.emit("state:changed", this.state.snapshot());
  }

  select(id) {
    this.state.selectedId = id;
    this.overlay.setSelected(id);
    this.events.emit("selection:changed", id);
  }
  getSelected() {
    return this.state.findById(this.state.selectedId);
  }

  updateSelectedProps(patch) {
    const el = this.getSelected();
    if (!el) return;
    Object.assign(el.props, patch);
    this._commit();
  }
  deleteElement(id) {
    this._removeById(id);
    if (this.state.selectedId === id) this.state.selectedId = null;
    this._commit();
  }
}

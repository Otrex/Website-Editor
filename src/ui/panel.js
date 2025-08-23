import { Properties } from "../core/properties.js";

export class PropertiesPanel {
  constructor({ root, editor }) {
    this.root = root;
    this.editor = editor;
    this._mount();
  }
  _mount() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `<div class="element-state">
        <h4>Elements State</h4>
        <div id="el-count">0 elements</div>
        <div id="el-list" class="element-list"></div>
      </div>
      <h4>Properties</h4>
      <div id="props"></div>`;
    this.root.appendChild(wrap);

    this.countEl = wrap.querySelector("#el-count");
    this.listEl = wrap.querySelector("#el-list");

    this.props = new Properties({
      root: wrap.querySelector("#props"),
      eventBus: this.editor.events,
      registry: this.editor.registry,
      getSelected: () => this.editor.getSelected(),
      updateSelected: (patch) => this.editor.updateSelectedProps(patch),
    });

    this.editor.events.on("state:changed", () => this.renderList());
    this.editor.events.on("selection:changed", () => this.renderList());
    this.renderList();
  }

  renderList() {
    const st = this.editor.state.snapshot();

    const renderSnap = (el, parent = false) => {
      if (!el.children || el.children.length === 0 || parent) {
        const text =
          el.props?.text && el.props.text.length > 20
            ? el.props.text.slice(0, 20) + "…"
            : el.props?.text || el.id;
        const selected = st.selectedId === el.id ? "selected" : "";
        return `<div class="element-item ${selected}" data-id="${el.id}">
        <span>${el.type} - ${text}</span>
        <button class="delete-btn" data-del="${el.id}">×</button>
      </div>`;
      }

      const childrenHTML = el.children.map((ch) => renderSnap(ch)).join("");
      const parentHTML = renderSnap(el, true);

      return `<div class="element-item-group">
      ${parentHTML}
      <div class="element-children">
        ${childrenHTML}
      </div>
      </div>`;
    };

    this.countEl.textContent = `${st.elements.length} element${
      st.elements.length !== 1 ? "s" : ""
    }`;
    this.listEl.innerHTML = st.elements
      .map((el) => {
        return renderSnap(el);
      })
      .join("");

    this.listEl.querySelectorAll(".element-item").forEach((n) => {
      n.addEventListener("click", (e) => {
        if (e.target.matches("[data-del]")) {
          e.stopPropagation();
          this.editor.deleteElement(e.target.dataset.del);
        } else {
          this.editor.select(n.dataset.id);
        }
      });
    });
  }
}

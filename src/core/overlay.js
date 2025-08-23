export class Overlay {
  constructor({ overlayRoot, iframe, eventBus }) {
    this.root = overlayRoot;
    this.iframe = iframe;
    this.events = eventBus;
    this.selectedId = null;
    this._wire();
  }
  _wire() {
    this.root.addEventListener("click", (e) => {
      const box = e.target.closest(".element-overlay");
      if (box) {
        this.setSelected(box.dataset.elementId);
        this.events.emit("overlay:select", box.dataset.elementId);
      }
    });

    this.root.addEventListener("dragstart", (e) => {
      console.log("dragstart", e);

      const h = e.target.closest(".drag-handle");
      if (!h) return;
      const id = h.closest(".element-overlay").dataset.elementId;
      e.dataTransfer.setData("element-id", id);
      e.dataTransfer.effectAllowed = "move";
      h.closest(".element-overlay").classList.add("ghost");
    });
    this.root.addEventListener("dragend", (e) => {
      const h = e.target.closest(".drag-handle");

      console.log("dragend", e, h.closest(".element-overlay"));

      if (h) h.closest(".element-overlay").classList.remove("ghost");
    });

    // Drop highlighting
    this.root.addEventListener("dragover", (e) => {
      e.preventDefault();
      this._highlight(e);
    });
    this.root.addEventListener("drop", (e) => {
      e.preventDefault();

      console.log("drop", this._dropTarget(e), e);
      if (e.dataTransfer.effectAllowed === "copy") {
        this.events.emit("dnd:add", {
          type: window.__dragType,
          ...this._dropTarget(e),
        });
      } else if (e.dataTransfer.effectAllowed === "move") {
        this.events.emit("dnd:move", {
          id: e.dataTransfer.getData("element-id"),
          ...this._dropTarget(e),
        });
      } else {
        this.events.emit("overlay:drop", this._dropTarget(e));
      }

      this._clearHighlights();
    });
    this.root.addEventListener("dragleave", () => this._clearHighlights());
    this.events.on("render:done", () => this.sync());
  }

  sync() {
    this.root.innerHTML = "";
    const doc = this.iframe.contentDocument;
    if (!doc) return;

    const nodes = doc.querySelectorAll("[data-element-id]");
    nodes.forEach((el) => {
      const r = el.getBoundingClientRect();
      const box = document.createElement("div");
      box.className = "element-overlay";
      box.dataset.elementId = el.dataset.elementId;
      box.style.left = r.left + "px";
      box.style.top = r.top + "px";
      box.style.width = r.width + "px";
      box.style.height = r.height + "px";

      const handle = document.createElement("div");
      handle.className = "drag-handle";
      handle.textContent = "⋮⋮";
      handle.draggable = true;
      handle.title = "Drag to reorder";

      const tag = document.createElement("div");
      tag.textContent = el.tagName.toLowerCase();
      tag.className = "edit-overlay";
      box.append(handle, tag);
      this.root.appendChild(box);

      // container drop zone
      if (el.classList.contains("container")) {
        const dz = document.createElement("div");
        dz.className = "drop-zone";
        dz.dataset.parentId = el.dataset.elementId;
        dz.style.left = r.left + 10 + "px";
        dz.style.top = r.top + 10 + "px";
        dz.style.width = r.width - 20 + "px";
        dz.style.height = r.height - 20 + "px";
        dz.style.border = "2px dashed #cbd5e0";
        dz.style.borderRadius = "6px";
        this.root.appendChild(dz);
      }
    });

    // final root drop zone
    if (nodes.length) {
      const last = nodes[nodes.length - 1];
      const r = last.getBoundingClientRect();
      const dz = document.createElement("div");
      dz.className = "drop-zone";
      dz.style.left = r.left + "px";
      dz.style.top = r.bottom + 10 + "px";
      dz.style.width = r.width + "px";
      dz.style.height = "40px";
      this.root.appendChild(dz);
    }

    this._applySelection();
  }

  setSelected(id) {
    this.selectedId = id;
    this._applySelection();
  }
  _applySelection() {
    this.root
      .querySelectorAll(".element-overlay")
      .forEach((n) =>
        n.classList.toggle("selected", n.dataset.elementId === this.selectedId)
      );
  }

  _highlight(e) {
    this.root
      .querySelectorAll(".drop-zone")
      .forEach((z) => z.classList.remove("drag-over"));
    const z = e.target.closest(".drop-zone");
    if (z) z.classList.add("drag-over");
  }
  _clearHighlights() {
    this.root
      .querySelectorAll(".drop-zone")
      .forEach((z) => z.classList.remove("drag-over"));
  }

  _dropTarget(e) {
    const z = e.target.closest(".drop-zone");

    console.log("drop target", z);

    return {
      insertBefore: z?.dataset.insertBefore || null,
      parentId: z?.dataset.parentId || null,
    };
  }
}

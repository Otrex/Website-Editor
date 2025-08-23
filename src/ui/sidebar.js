export class Sidebar {
  constructor({ root, editor }) {
    this.root = root;
    this.editor = editor;
    this.render();
  }
  render() {
    const items = this.editor.registry.listComponents();
    this.root.innerHTML =
      `<h3>Components</h3>` +
      items
        .map(
          (i) =>
            `<div class="component-item" draggable="true" data-component-type="${
              i.type
            }">
        <div class="component-icon">${i.icon || "●"}</div>
        <span>${i.label}</span>
      </div>`
        )
        .join("");

    // Track drag type globally so Overlay drop can read it
    this.root.querySelectorAll("[data-component-type]").forEach((n) => {
      n.addEventListener("dragstart", (e) => {
        window.__dragType = n.dataset.componentType;
        e.dataTransfer.effectAllowed = "copy";
      });
    });
  }
}

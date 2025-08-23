export class Properties {
  constructor({ root, eventBus, getSelected, updateSelected, registry }) {
    this.root = root;
    this.events = eventBus;
    this.getSelected = getSelected;
    this.updateSelected = updateSelected;
    this.registry = registry;
    this.events.on("selection:changed", () => this.render());
  }

  render() {
    const el = this.getSelected();
    if (!el) {
      this.root.innerHTML = "<p>Select an element to edit its properties</p>";
      return;
    }
    const def = this.registry.get(el.type);
    const fields = def?.properties || [];
    const html = [
      `<div class="property-group"><label>Element Type</label><input type="text" value="${el.type}" readonly></div>`,
    ]
      .concat(fields.map((f) => this._fieldHtml(f, el.props?.[f.name])))
      .join("");

    console.log("Rendering props for", el, fields, html);

    this.root.innerHTML = html;

    // Wire inputs
    this.root.querySelectorAll("[data-prop]").forEach((input) => {
      input.addEventListener("input", (e) => {
        const name = input.dataset.prop;
        const value =
          input.type === "number" ? Number(input.value) : input.value;
        this.updateSelected({ [name]: value });
      });
    });
  }

  _fieldHtml(f, value) {
    const v = value ?? f.default ?? "";
    if (f.type === "text")
      return `<div class="property-group"><label>${f.label}</label><textarea data-prop="${f.name}">${v}</textarea></div>`;
    if (f.type === "color")
      return `<div class="property-group"><label>${f.label}</label><input data-prop="${f.name}" type="color" value="${v}"></div>`;
    if (f.type === "select")
      return `<div class="property-group"><label>${
        f.label
      }</label><select data-prop="${f.name}">${f.options
        .map(
          (o) =>
            `<option value="${o.value}" ${o.value == v ? "selected" : ""}>${
              o.label
            }</option>`
        )
        .join("")}</select></div>`;
    if (f.type === "number")
      return `<div class="property-group"><label>${f.label}</label><input data-prop="${f.name}" type="number" value="${v}"></div>`;
    return `<div class="property-group"><label>${f.label}</label><input data-prop="${f.name}" value="${v}"></div>`;
  }
}

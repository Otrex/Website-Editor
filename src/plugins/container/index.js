// import './styles.css';

const ContainerPlugin = {
  elements: [
    {
      type: "container",
      label: "Container",
      sidebar: { type: "container", label: "Container", icon: "📦" },
      defaults: { background: "#f7fafc", padding: 20, radius: 8 },
      canHaveChildren: true,
      properties: [
        {
          name: "background",
          label: "Background",
          type: "color",
          default: "#f7fafc",
        },
        { name: "padding", label: "Padding (px)", type: "number", default: 20 },
        {
          name: "radius",
          label: "Border Radius (px)",
          type: "number",
          default: 8,
        },
      ],
      render(node, { renderChild }) {
        const { id, props } = node;
        const children = (node.children || [])
          .map((c) => renderChild(c))
          .join("");
        const style = `background:${props.background}; padding:${props.padding}px; border-radius:${props.radius}px; border:1px solid #e2e8f0; min-height:100px; position:relative;`;
        const placeholder = node.children?.length
          ? ""
          : '<div class="container-placeholder">Drop elements here</div>';
        return `<div class="element container" data-element-id="${id}" style="${style}">${children}${placeholder}</div>`;
      },
    },
  ],
};

export default ContainerPlugin;

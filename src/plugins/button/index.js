export default {
  elements: [
    {
      type: "button",
      label: "Button",
      sidebar: { type: "button", label: "Button", icon: "⏺" },
      defaults: { text: "Click me", url: "#", variant: "primary" },
      properties: [
        { name: "text", label: "Text", type: "text", default: "Click me" },
        { name: "url", label: "URL", type: "text", default: "#" },
        {
          name: "variant",
          label: "Variant",
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
          default: "primary",
        },
        {
          name: "class",
          label: "Classes",
          type: "text",
          default: "",
        },
      ],
      render(node) {
        const { id, props } = node;

        const classes = [props.class || "", "element", "button"];
        const classNames = `class="${classes.join(" ").trim()}"`;
        const style =
          props.variant === "primary"
            ? "background:#3182ce;color:#fff"
            : "background:#e2e8f0;color:#1a202c";
        return `<a ${classNames} data-element-id="${id}" href="${props.url}" style="padding:10px 20px;border-radius:6px;${style};display:inline-block;text-decoration:none;font-size:14px">${props.text}</a>`;
      },
    },
  ],
};

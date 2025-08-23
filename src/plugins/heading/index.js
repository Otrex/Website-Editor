// import './styles.css';
import { escapeHtml } from "../../core/utils.js";

const HeadingPlugin = {
  elements: [
    {
      type: "heading",
      label: "Heading",
      sidebar: { type: "heading", label: "Heading", icon: "H" },
      defaults: { text: "New Heading", level: 1, color: "#2d3748" },
      properties: [
        { name: "text", label: "Text", type: "text", default: "New Heading" },
        {
          name: "level",
          label: "Heading Level",
          type: "select",
          options: [1, 2, 3, 4, 5, 6].map((n) => ({
            label: `H${n}`,
            value: n,
          })),
          default: 1,
        },
        {
          name: "class",
          label: "Classes",
          type: "text",
          default: "",
        },
        { name: "color", label: "Color", type: "color", default: "#2d3748" },
      ],
      render(node) {
        const { id, props } = node;
        console.log("Rendering heading", node);

        const level = props.level || 1;
        const classes = [props.class || "", "element", "heading"];
        const classNames = `class="${classes.join(" ").trim()}"`;
        const tag = `h${Math.min(6, Math.max(1, level))}`;
        return `<${tag} ${classNames} style="color:${
          props.color
        }" data-element-id="${id}">${escapeHtml(props.text)}</${tag}>`;
      },
    },
  ],
};

export default HeadingPlugin;

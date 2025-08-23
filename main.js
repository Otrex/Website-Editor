import { Editor } from "./src/core/editor.js";
import { Sidebar } from "./src/ui/sidebar.js";
import { PropertiesPanel } from "./src/ui/panel.js";

// Plugins
import HeadingPlugin from "./src/plugins/heading/index.js";
import ContainerPlugin from "./src/plugins/container/index.js";
import ButtonPlugin from "./src/plugins/button/index.js";

const editor = new Editor({
  iframe: document.getElementById("canvas-iframe"),
  overlay: document.getElementById("overlay"),
  propertiesRoot: document.getElementById("properties"),
});

// Register plugins
editor.registerPlugin(HeadingPlugin);
editor.registerPlugin(ContainerPlugin);
editor.registerPlugin(ButtonPlugin);

// Mount UI
const sidebar = new Sidebar({
  root: document.getElementById("sidebar"),
  editor,
});
const panel = new PropertiesPanel({
  root: document.getElementById("properties"),
  editor,
});

// // Demo content
// editor.addElement({
//   type: "heading",
//   props: { text: "Welcome to the Editor", level: 1 },
// });
editor.addElement({ type: "container", props: { background: "#f7fafc" } });

export class State {
  constructor() { this.elements = []; this.selectedId = null; }
  snapshot() { return JSON.parse(JSON.stringify({ elements: this.elements, selectedId: this.selectedId })); }
  findById(id, nodes = this.elements) {
    for (const el of nodes) { if (el.id === id) return el; if (el.children) { const f = this.findById(id, el.children); if (f) return f; } }
    return null;
  }
  removeById(id, nodes = this.elements) {
    for (let i=0;i<nodes.length;i++){ const el=nodes[i]; if(el.id===id) return nodes.splice(i,1)[0]; if(el.children){ const r=this.removeById(id, el.children); if(r) return r; } }
    return null;
  }
}
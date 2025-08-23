export class DnDManager {
  constructor({ sidebarRoot, overlay, eventBus }){ this.sidebarRoot = sidebarRoot; this.overlay = overlay; this.events = eventBus; this._wire(); }
  _wire(){
    // Sidebar components drag
    this.sidebarRoot.addEventListener('dragstart', (e)=>{
      const item = e.target.closest('[data-component-type]');
      if(!item) return;
      e.dataTransfer.setData('component-type', item.dataset.componentType);
      e.dataTransfer.effectAllowed = 'copy';
    });

    // Overlay routed via Overlay events
    this.events.on('overlay:drop', ({ insertBefore, parentId }) => {
      // Read dataTransfer indirectly is tricky; instead, we track via global dragstart
      // Approach: rely on last dragstart type stored on window
      const t = window.__dragType; const id = window.__dragElementId;
      if (t) this.events.emit('dnd:add', { type: t, insertBefore, parentId });
      else if (id) this.events.emit('dnd:move', { id, insertBefore, parentId });
      window.__dragType = null; window.__dragElementId = null;
    });

    // Hook overlay handle dragstart to track moves
    document.addEventListener('dragstart', (e)=>{
      const h = e.target.closest('.drag-handle');
      if (h){ const id = h.closest('.element-overlay')?.dataset.elementId; if(id){ window.__dragElementId = id; } }
    });
  }
}
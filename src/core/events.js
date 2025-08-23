export class EventBus {
  constructor() { 
    this.listeners = new Map(); 
  }
  on(type, cb) { 
    this.listeners.set(type, (this.listeners.get(type) || []).concat(cb)); 
    return () => this.off(type, cb); 
  }
  off(type, cb) { 
    this.listeners.set(type, (this.listeners.get(type) || []).filter(fn => fn !== cb)); 
  }
  emit(type, payload) { 
    (this.listeners.get(type) || []).forEach(fn => fn(payload)); 
  }
}
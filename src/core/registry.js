export class Registry {
  constructor(){ this.map = new Map(); this.components = []; }
  register(def){ this.map.set(def.type, def); if(def.sidebar){ this.components.push(def.sidebar); } }
  get(type){ return this.map.get(type); }
  listComponents(){ return this.components; }
}
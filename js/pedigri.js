/**
 * MendelSim — Motor de Pedigríes SVG
 * Interactive pedigree engine using SVG
 */

class PedigreeEngine {
  constructor(svgId, infoId) {
    this.svg = document.getElementById(svgId);
    this.infoEl = infoId ? document.getElementById(infoId) : null;
    this.individuals = new Map(); // id → {id, sex, affected, x, y, label, genotype, carrier}
    this.couples = [];  // [{id, p1, p2, children:[]}]
    this.currentTool = 'select';
    this.selectedIds = [];
    this.childSex = null; // null = random, 'M' = male, 'F' = female
    this.dragState = null;
    this._suppressNextClick = false;
    this._nextId = 1;
    this._nextCoupleId = 1;
    this.readOnly = false;
    this.sexLabels = {
      male: 'Hombre',
      female: 'Mujer',
      maleLower: 'hombre',
      femaleLower: 'mujer',
      malePlural: 'hombres',
      femalePlural: 'mujeres',
    };

    // Sizes
    this.MALE_SIZE = 28;    // rect side (half = 14)
    this.FEMALE_R  = 14;    // circle radius
    this.LABEL_DY  = 27;    // label offset below shape
    this.GENO_DY   = 42;    // genotype label offset

    if (this.svg) {
      this.svg.addEventListener('click', (e) => this._onSVGClick(e));
      this.svg.addEventListener('mousemove', (e) => this._onMouseMove(e));
      this.svg.addEventListener('pointerdown', (e) => this._onPointerDown(e));
      this.svg.addEventListener('pointermove', (e) => this._onPointerMove(e));
      this.svg.addEventListener('pointerup', (e) => this._onPointerUp(e));
      this.svg.addEventListener('pointercancel', (e) => this._onPointerUp(e));
      this._updateCursor();
    }
  }

  // ── Tool management ──────────────────────────────────────

  setTool(tool) {
    this.currentTool = tool;
    this.selectedIds = [];
    this.dragState = null;
    this._updateInfo();
    this._updateCursor();
    this.render();
  }

  setChildSex(sex) {
    this.childSex = (sex === 'M' || sex === 'F') ? sex : null;
    this._updateInfo();
  }

  setSexLabels(labels = {}) {
    this.sexLabels = {
      ...this.sexLabels,
      ...labels,
    };
    this._updateInfo();
    this.render();
  }

  _sexLabel(sex) {
    return sex === 'M' ? this.sexLabels.male : this.sexLabels.female;
  }

  _childSexLabel() {
    if (this.childSex === 'M') return this.sexLabels.maleLower;
    if (this.childSex === 'F') return this.sexLabels.femaleLower;
    return 'aleatorio';
  }

  _toSuperscript(text) {
    const map = {
      A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ',
      N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', S: 'ˢ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',
      a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ',
      n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
      0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹',
    };
    return String(text || '').split('').map(ch => map[ch] || ch).join('');
  }

  _formatPlainGenotype(text) {
    return String(text || '').replace(/([A-Za-z])\^([A-Za-z0-9]+)/g, (_, base, sup) => {
      return base + this._toSuperscript(sup);
    });
  }

  _toolInstructions() {
    const map = {
      'select':        'Arrastra un individuo para moverlo.',
      'addMale':       `Haz clic en el lienzo para añadir un ${this.sexLabels.maleLower}.`,
      'addFemale':     `Haz clic en el lienzo para añadir una ${this.sexLabels.femaleLower}.`,
      'toggleAffected':'Haz clic en un individuo para cambiar su estado (afectado/normal).',
      'toggleCarrier': 'Haz clic en un individuo para cambiar su estado de portador.',
      'couple':        this.selectedIds.length === 0
                         ? 'Haz clic en el PRIMER individuo de la pareja.'
                         : 'Haz clic en el SEGUNDO individuo para unirlos.',
      'child':         this.selectedIds.length === 0
                         ? 'Haz clic en un individuo de la pareja progenitora.'
                         : `Haz clic en otro individuo de la pareja, o en el lienzo para añadir un descendiente (${this._childSexLabel()}).`,
      'delete':        'Haz clic en un individuo para eliminarlo.',
    };
    return map[this.currentTool] || '';
  }

  _updateInfo() {
    if (this.infoEl) {
      const names = {
        select: 'Mover', addMale: `Añadir ${this.sexLabels.maleLower}`, addFemale: `Añadir ${this.sexLabels.femaleLower}`,
        toggleAffected: 'Marcar afectado', toggleCarrier: 'Marcar portador', couple: 'Crear pareja',
        child: `Añadir descendiente (${this._childSexLabel()})`, delete: 'Eliminar'
      };
      this.infoEl.textContent = `🔧 Herramienta: ${names[this.currentTool] || this.currentTool} — ${this._toolInstructions()}`;
    }
  }

  _updateCursor() {
    if (!this.svg) return;
    if (this.dragState) {
      this.svg.style.cursor = 'grabbing';
      return;
    }
    const cursors = {
      select: 'grab',
      addMale: 'crosshair',
      addFemale: 'crosshair',
      couple: 'pointer',
      child: 'crosshair',
      toggleAffected: 'pointer',
      toggleCarrier: 'pointer',
      delete: 'not-allowed',
    };
    this.svg.style.cursor = cursors[this.currentTool] || 'default';
  }

  // ── SVG event handlers ───────────────────────────────────

  _getSVGPoint(e) {
    const rect = this.svg.getBoundingClientRect();
    const scaleX = this.svg.viewBox.baseVal.width  / rect.width;
    const scaleY = this.svg.viewBox.baseVal.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY
    };
  }

  _onMouseMove(e) {
    if (this.readOnly) return;
  }

  _onPointerDown(e) {
    if (this.readOnly || this.currentTool !== 'select') return;
    if (e.button !== undefined && e.button !== 0) return;
    const pt = this._getSVGPoint(e);
    const clicked = this._findIndividualAt(pt.x, pt.y);
    if (!clicked) return;

    e.preventDefault();
    this.selectedIds = [clicked.id];
    this.dragState = {
      id: clicked.id,
      pointerId: e.pointerId,
      startX: pt.x,
      startY: pt.y,
      originX: clicked.x,
      originY: clicked.y,
      moved: false
    };
    if (this.svg.setPointerCapture) {
      this.svg.setPointerCapture(e.pointerId);
    }
    this._updateCursor();
    this.render();
  }

  _onPointerMove(e) {
    if (!this.dragState) return;
    const ind = this.individuals.get(this.dragState.id);
    if (!ind) return;

    e.preventDefault();
    const pt = this._getSVGPoint(e);
    const dx = pt.x - this.dragState.startX;
    const dy = pt.y - this.dragState.startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) this.dragState.moved = true;

    const viewBox = this.svg.viewBox.baseVal;
    const margin = 20;
    ind.x = this._snap(Math.min(Math.max(this.dragState.originX + dx, margin), viewBox.width - margin));
    ind.y = this._snap(Math.min(Math.max(this.dragState.originY + dy, margin), viewBox.height - margin));
    this.render();
  }

  _onPointerUp(e) {
    if (!this.dragState) return;
    const moved = this.dragState.moved;
    if (this.svg.releasePointerCapture) {
      try { this.svg.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    this.dragState = null;
    if (moved) {
      this._suppressNextClick = true;
      if (this.autoLabel) { this._computeStandardLabels(); this.render(); }
    }
    this._updateCursor();
    this._updateInfo();
  }

  _onSVGClick(e) {
    if (this.readOnly) return;
    if (this._suppressNextClick) {
      this._suppressNextClick = false;
      return;
    }
    const pt = this._getSVGPoint(e);
    // Snap to 20px grid
    const x = this._snap(pt.x);
    const y = this._snap(pt.y);

    // Check if clicked on an individual
    const clicked = this._findIndividualAt(pt.x, pt.y);

    if (this.currentTool === 'addMale') {
      if (!clicked) this.addIndividual('M', x, y);
    } else if (this.currentTool === 'addFemale') {
      if (!clicked) this.addIndividual('F', x, y);
    } else if (this.currentTool === 'toggleAffected' && clicked) {
      this.toggleAffected(clicked.id);
    } else if (this.currentTool === 'toggleCarrier' && clicked) {
      this.toggleCarrier(clicked.id);
    } else if (this.currentTool === 'delete' && clicked) {
      this.deleteIndividual(clicked.id);
    } else if (this.currentTool === 'couple') {
      if (clicked) this._handleCoupleClick(clicked.id);
    } else if (this.currentTool === 'child') {
      this._handleChildClick(clicked, x, y);
    } else if (this.currentTool === 'select') {
      if (clicked) {
        this.selectedIds = [clicked.id];
        this.render();
      } else {
        this.selectedIds = [];
        this.render();
      }
    }
    this._updateInfo();
  }

  _findIndividualAt(x, y) {
    const HIT = 20; // hit area radius
    for (const [, ind] of this.individuals) {
      const dx = x - ind.x, dy = y - ind.y;
      if (Math.sqrt(dx * dx + dy * dy) <= HIT) return ind;
    }
    return null;
  }

  _snap(value) {
    return Math.round(value / 20) * 20;
  }

  _resolveChildSex() {
    return this.childSex || (Math.random() > 0.5 ? 'M' : 'F');
  }

  _handleCoupleClick(id) {
    if (!this.selectedIds.includes(id)) {
      this.selectedIds.push(id);
    }
    if (this.selectedIds.length === 2) {
      this.createCouple(this.selectedIds[0], this.selectedIds[1]);
      this.selectedIds = [];
    }
    this.render();
  }

  _handleChildClick(clicked, x, y) {
    if (this.selectedIds.length === 0) {
      // First click: select a parent
      if (clicked) {
        this.selectedIds = [clicked.id];
        this.render();
      }
    } else if (this.selectedIds.length === 1) {
      if (this.selectedIds._isCouple) {
        if (!clicked) {
          this.addChild(this.selectedIds[0], this._resolveChildSex(), x, y);
          this.selectedIds = [];
          this.render();
        }
        return;
      }
      if (clicked && clicked.id !== this.selectedIds[0]) {
        // Second parent click: find the couple and add child automatically
        const coupleId = this._findCoupleId(this.selectedIds[0], clicked.id);
        if (coupleId !== null) {
          const p1 = this.individuals.get(this.selectedIds[0]);
          const p2 = this.individuals.get(clicked.id);
          const couple = this.couples.find(c => c.id === coupleId);
          const existingChildren = (couple.children || [])
            .map(cid => this.individuals.get(cid)).filter(Boolean);
          let cx, cy;
          if (existingChildren.length > 0) {
            // Place to the right of the rightmost sibling, same row
            const rightmost = existingChildren.reduce((a, b) => a.x >= b.x ? a : b);
            cx = this._snap(rightmost.x + 60);
            cy = rightmost.y;
          } else {
            cx = this._snap((p1.x + p2.x) / 2);
            cy = this._snap(Math.max(p1.y, p2.y) + 80);
          }
          this.addChild(coupleId, this._resolveChildSex(), cx, cy);
          this.selectedIds = [];
          this.render();
        } else {
          // No couple yet — keep both selected so canvas click can place child
          this.selectedIds = [this.selectedIds[0], clicked.id];
          this.render();
        }
      } else if (!clicked) {
        // Canvas click: if we have a single parent selected, find their couple
        const p1id = this.selectedIds[0];
        const couple = this.couples.find(c => c.p1 === p1id || c.p2 === p1id);
        if (couple) {
          this.addChild(couple.id, this._resolveChildSex(), x, y);
          this.selectedIds = [];
          this.render();
        }
      }
    } else if (this.selectedIds.length === 2) {
      if (clicked && clicked.id !== this.selectedIds[0] && clicked.id !== this.selectedIds[1]) {
        // Clicked a third individual — restart selection
        this.selectedIds = [clicked.id];
        this.render();
      } else if (!clicked) {
        // Canvas click: place child between the two selected parents
        const coupleId = this._findCoupleId(this.selectedIds[0], this.selectedIds[1]);
        if (coupleId !== null) {
          this.addChild(coupleId, this._resolveChildSex(), x, y);
        }
        this.selectedIds = [];
        this.render();
      }
    }
  }

  _findCoupleId(p1, p2) {
    const c = this.couples.find(c =>
      (c.p1 === p1 && c.p2 === p2) || (c.p1 === p2 && c.p2 === p1)
    );
    return c ? c.id : null;
  }

  // ── Standard label computation ───────────────────────────

  _computeStandardLabels() {
    if (this.individuals.size === 0) return;
    const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
    const childIds = new Set();
    for (const c of this.couples)
      for (const cid of c.children) childIds.add(cid);

    const genMap = new Map();
    const queue = [];
    for (const [id] of this.individuals) {
      if (!childIds.has(id)) { genMap.set(id, 1); queue.push(id); }
    }
    if (queue.length === 0) {
      for (const [id] of this.individuals) { genMap.set(id, 1); queue.push(id); }
    }
    let qi = 0;
    while (qi < queue.length) {
      const id = queue[qi++];
      const gen = genMap.get(id);
      for (const c of this.couples) {
        if (c.p1 === id || c.p2 === id) {
          for (const cid of c.children) {
            if (!genMap.has(cid)) { genMap.set(cid, gen + 1); queue.push(cid); }
          }
        }
      }
    }
    for (const [id] of this.individuals)
      if (!genMap.has(id)) genMap.set(id, 1);

    const groups = new Map();
    for (const [id, gen] of genMap) {
      if (!groups.has(gen)) groups.set(gen, []);
      groups.get(gen).push(id);
    }
    for (const [gen, ids] of groups) {
      ids.sort((a, b) => (this.individuals.get(a)?.x ?? 0) - (this.individuals.get(b)?.x ?? 0));
      const roman = ROMAN[gen - 1] || `G${gen}`;
      ids.forEach((id, i) => {
        const ind = this.individuals.get(id);
        if (ind) ind.label = `${roman}-${i + 1}`;
      });
    }
  }

  // ── Builder ──────────────────────────────────────────────

  addIndividual(sex, x, y, options = {}) {
    const id = options.id || this._nextId++;
    if (id >= this._nextId) this._nextId = id + 1;
    const ind = {
      id,
      sex,
      affected: options.affected || false,
      carrier:  options.carrier  || false,
      x,
      y,
      label: options.label || `#${id}`,
      genotype: options.genotype || '',
    };
    this.individuals.set(id, ind);
    if (this.autoLabel) this._computeStandardLabels();
    this.render();
    return ind;
  }

  toggleAffected(id) {
    const ind = this.individuals.get(id);
    if (!ind) return;
    ind.affected = !ind.affected;
    if (ind.affected) ind.carrier = false;
    this.render();
  }

  toggleCarrier(id) {
    const ind = this.individuals.get(id);
    if (!ind) return;
    ind.carrier = !ind.carrier;
    if (ind.carrier) ind.affected = false;
    this.render();
  }

  createCouple(id1, id2) {
    // Check not already a couple
    const exists = this.couples.find(c =>
      (c.p1 === id1 && c.p2 === id2) || (c.p1 === id2 && c.p2 === id1)
    );
    if (exists) return exists;
    const couple = {
      id: `c${this._nextCoupleId++}`,
      p1: id1,
      p2: id2,
      children: []
    };
    this.couples.push(couple);
    if (this.autoLabel) this._computeStandardLabels();
    this.render();
    return couple;
  }

  addChild(coupleId, sex, x, y) {
    const couple = this.couples.find(c => c.id === coupleId);
    if (!couple) return null;
    sex = sex || (Math.random() > 0.5 ? 'M' : 'F');
    const child = this.addIndividual(sex, x, y);
    couple.children.push(child.id);
    if (this.autoLabel) this._computeStandardLabels();
    this.render();
    return child;
  }

  deleteIndividual(id) {
    this.individuals.delete(id);
    for (const couple of this.couples) {
      couple.children = couple.children.filter(c => c !== id);
    }
    this.couples = this.couples.filter(c => c.p1 !== id && c.p2 !== id);
    this.selectedIds = this.selectedIds.filter(s => s !== id);
    if (this.autoLabel) this._computeStandardLabels();
    this.render();
  }

  clear() {
    this.individuals.clear();
    this.couples = [];
    this.selectedIds = [];
    this.dragState = null;
    this._nextId = 1;
    this._nextCoupleId = 1;
    this._updateCursor();
    this.render();
  }

  // ── Load exercise ────────────────────────────────────────

  loadExercise(exerciseData) {
    this.individuals.clear();
    this.couples = [];
    this.selectedIds = [];
    this.dragState = null;
    this._nextId = 1;
    this._nextCoupleId = 1;
    this._updateCursor();

    for (const ind of exerciseData.individuals) {
      this.individuals.set(ind.id, {
        id:       ind.id,
        sex:      ind.sex,
        affected: ind.affected,
        carrier:  ind.carrier || false,
        _initCarrier: ind.carrier || false,
        x:        ind.x,
        y:        ind.y,
        label:    ind.label,
        genotype: ind.genotype || '',
      });
      if (ind.id >= this._nextId) this._nextId = ind.id + 1;
    }

    for (const c of exerciseData.couples) {
      this.couples.push({
        id:       c.id,
        p1:       c.p1,
        p2:       c.p2,
        children: [...c.children],
      });
      const num = parseInt(c.id.replace(/[^\d]/g, ''));
      if (!isNaN(num) && num >= this._nextCoupleId) this._nextCoupleId = num + 1;
    }
    this.render();
  }

  showSolution(answer) {
    if (!answer || !answer.genotypes) return;
    for (const [, ind] of this.individuals) {
      ind.genotype = '';
      ind.carrier = false;
    }
    for (const [idStr, geno] of Object.entries(answer.genotypes)) {
      const id = parseInt(idStr);
      const ind = this.individuals.get(id);
      if (!ind) continue;
      ind.genotype = geno;
      // Mark carriers based on genotypeLabels
      if (answer.genotypeLabels && answer.genotypeLabels[id]) {
        const lbl = answer.genotypeLabels[id].toLowerCase();
        ind.carrier = lbl.includes('portador');
      }
    }
    this.render();
  }

  hideSolution() {
    for (const [, ind] of this.individuals) {
      ind.genotype = '';
      ind.carrier = ind._initCarrier || false;
    }
    this.render();
  }

  // ── Rendering ────────────────────────────────────────────

  render() {
    if (!this.svg) return;
    // Clear SVG
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);

    // Draw relationships first (below individuals)
    this._renderRelationships();

    // Draw individuals
    for (const [, ind] of this.individuals) {
      this._renderIndividual(ind);
    }
  }

  _renderRelationships() {
    for (const couple of this.couples) {
      const p1 = this.individuals.get(couple.p1);
      const p2 = this.individuals.get(couple.p2);
      if (!p1 || !p2) continue;

      // Horizontal couple line between centers
      const leftX  = Math.min(p1.x, p2.x);
      const rightX = Math.max(p1.x, p2.x);
      const midY   = (p1.y + p2.y) / 2;
      const midX   = (p1.x + p2.x) / 2;
      const leftInd = p1.x <= p2.x ? p1 : p2;
      const rightInd = p1.x <= p2.x ? p2 : p1;
      const leftRadius = leftInd.sex === 'M' ? this.MALE_SIZE / 2 : this.FEMALE_R;
      const rightRadius = rightInd.sex === 'M' ? this.MALE_SIZE / 2 : this.FEMALE_R;

      this._svgLine(leftX + leftRadius, midY, rightX - rightRadius, midY, 'ped-line');

      // Descent line if children exist
      if (couple.children.length > 0) {
        const DROP = 40; // vertical distance from couple line to child row
        const childInds = couple.children
          .map(cid => this.individuals.get(cid))
          .filter(Boolean);

        if (childInds.length === 0) continue;

        // Vertical drop from midpoint
        const childY = childInds[0].y;
        const sibY   = childY - DROP + 10;

        // Vertical line from couple midpoint down to sibship line
        this._svgLine(midX, midY, midX, sibY, 'ped-line');

        // Horizontal sibship line, including the couple midpoint so single offset
        // children stay connected to the descent line.
        const childXs = childInds.map(c => c.x);
        const minCX = Math.min(...childXs);
        const maxCX = Math.max(...childXs);
        const minLineX = Math.min(minCX, midX);
        const maxLineX = Math.max(maxCX, midX);

        if (minLineX !== maxLineX) {
          this._svgLine(minLineX, sibY, maxLineX, sibY, 'ped-line');
        }

        // Vertical lines to each child
        for (const child of childInds) {
          this._svgLine(child.x, sibY, child.x, child.y - this.FEMALE_R, 'ped-line');
        }
      }
    }
  }

  _renderIndividual(ind) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'ped-ind');
    g.setAttribute('data-id', ind.id);

    const isSelected = this.selectedIds.includes(ind.id);

    if (ind.sex === 'M') {
      // Male: rectangle
      const hs = this.MALE_SIZE / 2;
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x',      ind.x - hs);
      rect.setAttribute('y',      ind.y - hs);
      rect.setAttribute('width',  this.MALE_SIZE);
      rect.setAttribute('height', this.MALE_SIZE);
      rect.setAttribute('rx',     '2');

      if (ind.affected) {
        rect.setAttribute('fill',   'var(--affected)');
        rect.setAttribute('stroke', 'var(--affected)');
      } else if (ind.carrier) {
        rect.setAttribute('fill',   '#fff');
        rect.setAttribute('stroke', 'var(--carrier)');
        rect.setAttribute('stroke-width', '2.5');
      } else {
        rect.setAttribute('fill',   '#ffffff');
        rect.setAttribute('stroke', isSelected ? 'var(--primary-light)' : '#2c3e50');
      }
      rect.setAttribute('stroke-width', isSelected ? '3' : '2');
      g.appendChild(rect);

      // Carrier dot for males
      if (ind.carrier && !ind.affected) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', ind.x);
        dot.setAttribute('cy', ind.y);
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', 'var(--carrier)');
        g.appendChild(dot);
      }
    } else {
      // Female: circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', ind.x);
      circle.setAttribute('cy', ind.y);
      circle.setAttribute('r',  this.FEMALE_R);

      if (ind.affected) {
        circle.setAttribute('fill',   'var(--affected)');
        circle.setAttribute('stroke', 'var(--affected)');
      } else if (ind.carrier) {
        circle.setAttribute('fill',   '#fff');
        circle.setAttribute('stroke', 'var(--carrier)');
        circle.setAttribute('stroke-width', '2.5');
      } else {
        circle.setAttribute('fill',   '#ffffff');
        circle.setAttribute('stroke', isSelected ? 'var(--primary-light)' : '#2c3e50');
      }
      circle.setAttribute('stroke-width', isSelected ? '3' : '2');
      g.appendChild(circle);

      // Carrier dot for females
      if (ind.carrier && !ind.affected) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', ind.x);
        dot.setAttribute('cy', ind.y);
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', 'var(--carrier)');
        g.appendChild(dot);
      }
    }

    // Label below shape
    const labelY = ind.y + this.LABEL_DY;
    const labelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelEl.setAttribute('x', ind.x);
    labelEl.setAttribute('y', labelY);
    labelEl.setAttribute('class', 'ped-label');
    labelEl.textContent = ind.label;
    g.appendChild(labelEl);

    // Genotype label
    if (ind.genotype) {
      const genoEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      genoEl.setAttribute('x', ind.x);
      genoEl.setAttribute('y', ind.y + this.GENO_DY);
      genoEl.setAttribute('class', 'ped-genotype');
      genoEl.textContent = this._formatPlainGenotype(ind.genotype);
      g.appendChild(genoEl);
    }

    // Tooltip via SVG title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    let ttText = `${ind.label} — ${this._sexLabel(ind.sex)}`;
    if (ind.affected) ttText += ' (Afectado/a)';
    if (ind.carrier)  ttText += ' (Portador/a)';
    if (ind.genotype) ttText += `\nGenotipo: ${this._formatPlainGenotype(ind.genotype)}`;
    title.textContent = ttText;
    g.appendChild(title);

    this.svg.appendChild(g);
  }

  _svgLine(x1, y1, x2, y2, cssClass) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', cssClass);
    this.svg.appendChild(line);
    return line;
  }

  // ── Analysis ─────────────────────────────────────────────

  /**
   * Attempt to auto-detect inheritance pattern from pedigree.
   * Returns 'AD' | 'AR' | 'XR' | 'XD' | 'unknown'
   */
  analyzePattern() {
    const inds = Array.from(this.individuals.values());
    const affected = inds.filter(i => i.affected);
    if (affected.length === 0) return 'unknown';

    const affectedMales   = affected.filter(i => i.sex === 'M').length;
    const affectedFemales = affected.filter(i => i.sex === 'F').length;
    const total = affected.length;

    // Check if all affected are male → possible X-linked
    const maleOnly = affectedFemales === 0 && affectedMales > 0;

    // Check if affected parent has affected children
    let affectedParentHasAffectedChild = false;
    let unaffectedParentsHaveAffectedChild = false;
    let affectedFatherAllDaughters = false;

    for (const couple of this.couples) {
      const p1 = this.individuals.get(couple.p1);
      const p2 = this.individuals.get(couple.p2);
      if (!p1 || !p2) continue;
      const children = couple.children.map(cid => this.individuals.get(cid)).filter(Boolean);
      const affChildren = children.filter(c => c.affected);

      if ((p1.affected || p2.affected) && affChildren.length > 0) {
        affectedParentHasAffectedChild = true;

        // XD check: affected father → all daughters affected, no sons affected
        const father = p1.sex === 'M' ? p1 : p2;
        if (father.affected) {
          const sons      = children.filter(c => c.sex === 'M');
          const daughters = children.filter(c => c.sex === 'F');
          if (daughters.length > 0 && sons.length > 0) {
            const allDaughtersAff = daughters.every(d => d.affected);
            const noSonsAff       = sons.every(s => !s.affected);
            if (allDaughtersAff && noSonsAff) affectedFatherAllDaughters = true;
          }
        }
      }

      if (!p1.affected && !p2.affected && affChildren.length > 0) {
        unaffectedParentsHaveAffectedChild = true;
      }
    }

    if (affectedFatherAllDaughters) return 'XD';
    if (maleOnly && !affectedParentHasAffectedChild) return 'XR';
    if (unaffectedParentsHaveAffectedChild) return 'AR';
    if (affectedParentHasAffectedChild && !unaffectedParentsHaveAffectedChild) return 'AD';

    return 'unknown';
  }

  /**
   * Get pattern display info
   */
  getPatternInfo(pattern) {
    const map = {
      AR: { name: 'Autosómica Recesiva', class: 'pattern-AR', description: 'El alelo causante es recesivo y está en un autosoma. Dos progenitores portadores (Aa) pueden tener descendencia afectada (aa) sin estar afectados ellos mismos.' },
      AD: { name: 'Autosómica Dominante', class: 'pattern-AD', description: 'El alelo causante es dominante y está en un autosoma. Basta un alelo para expresar el rasgo. Un progenitor afectado transmite el rasgo a ~50% de su descendencia.' },
      XR: { name: 'Recesiva ligada al X', class: 'pattern-XR', description: `El gen está en el cromosoma X. Los ${this.sexLabels.malePlural} hemicigotos solo necesitan un alelo recesivo para estar afectados. Las ${this.sexLabels.femalePlural} portadoras (Xᴬ Xᵃ) no están afectadas pero transmiten el alelo.` },
      XD: { name: 'Dominante ligada al X', class: 'pattern-XD', description: this.sexLabels.maleLower === 'macho'
        ? 'El gen dominante está en el cromosoma X. Un progenitor macho afectado transmite el Xᴬ a toda su descendencia hembra, pero ningún alelo X a su descendencia macho.'
        : 'El gen dominante está en el cromosoma X. Un padre afectado transmite el Xᴬ a todas sus hijas (que serán afectadas) pero ningún alelo X a sus hijos (que no serán afectados).' },
      unknown: { name: 'Patrón no determinado', class: '', description: 'No hay suficientes datos para determinar el patrón de herencia.' },
    };
    return map[pattern] || map['unknown'];
  }
}

// Make available globally
window.PedigreeEngine = PedigreeEngine;

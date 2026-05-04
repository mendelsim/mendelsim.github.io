/**
 * MendelSim — Motor de Genética
 * Genetics engine for monohybrid, dihybrid, and X-linked calculations
 */

const Genetics = {

  /**
   * Parse a genotype string into an array of loci objects.
   * "AaBb" → [{a1:'A', a2:'a'}, {a1:'B', a2:'b'}]
   * "AA"   → [{a1:'A', a2:'A'}]
   * "ab"   → [{a1:'a', a2:'b'}]
   * Takes pairs of 2 characters each (case-sensitive input preserved per locus).
   */
  parseGenotype(str) {
    if (!str || typeof str !== 'string') return [];
    str = str.trim();
    const loci = [];
    // Each locus is a pair of 2 consecutive characters
    for (let i = 0; i + 1 < str.length; i += 2) {
      loci.push({ a1: str[i], a2: str[i + 1] });
    }
    return loci;
  },

  /**
   * Normalize a loci array:
   * - Within each locus, uppercase allele comes first (A before a)
   * - Sort loci alphabetically by the uppercase letter
   * e.g. [{a1:'a', a2:'A'}, {a1:'b', a2:'B'}] → [{a1:'A', a2:'a'}, {a1:'B', a2:'b'}]
   */
  normalizeGenotype(loci) {
    if (!loci || !loci.length) return [];
    const normalized = loci.map(loc => {
      const upper = [loc.a1, loc.a2].filter(a => a === a.toUpperCase() && a !== a.toLowerCase());
      const lower = [loc.a1, loc.a2].filter(a => a === a.toLowerCase() && a !== a.toUpperCase());
      const neutral = [loc.a1, loc.a2].filter(a => (a === a.toUpperCase() && a === a.toLowerCase()));
      // Sort: uppercase first, then lowercase
      const sorted = [...upper.sort(), ...lower.sort(), ...neutral.sort()];
      return { a1: sorted[0] || loc.a1, a2: sorted[1] || loc.a2 };
    });
    // Sort loci by uppercase letter (or first allele's uppercase version)
    normalized.sort((a, b) => {
      const keyA = (a.a1.toUpperCase() < a.a2.toUpperCase() ? a.a1.toUpperCase() : a.a2.toUpperCase());
      const keyB = (b.a1.toUpperCase() < b.a2.toUpperCase() ? b.a1.toUpperCase() : b.a2.toUpperCase());
      return keyA.localeCompare(keyB);
    });
    return normalized;
  },

  /**
   * Format a loci array back to string.
   * [{a1:'A', a2:'a'}, {a1:'B', a2:'b'}] → "AaBb"
   */
  formatGenotype(loci) {
    if (!loci || !loci.length) return '';
    return loci.map(loc => loc.a1 + loc.a2).join('');
  },

  /**
   * Generate all gametes from a set of loci (with repetition for Punnett display).
   * Uses combinatorial expansion (all combinations of one allele per locus).
   * [{a1:'A', a2:'a'}, {a1:'B', a2:'b'}] → ['AB', 'Ab', 'aB', 'ab']
   */
  generateGametes(loci) {
    if (!loci || !loci.length) return [];
    let gametes = [''];
    for (const loc of loci) {
      const alleles = [loc.a1, loc.a2];
      const newGametes = [];
      for (const g of gametes) {
        for (const a of alleles) {
          newGametes.push(g + a);
        }
      }
      gametes = newGametes;
    }
    return gametes;
  },

  /**
   * Build a Punnett square (2D array of genotype strings).
   * punnett[i][j] = normalized genotype from gametes1[i] + gametes2[j]
   */
  buildPunnett(gametes1, gametes2) {
    const punnett = [];
    for (const g1 of gametes1) {
      const row = [];
      for (const g2 of gametes2) {
        // Combine alleles from each gamete
        const combined = [];
        for (let i = 0; i < g1.length; i++) {
          combined.push({ a1: g1[i], a2: g2[i] });
        }
        const norm = this.normalizeGenotype(combined);
        row.push(this.formatGenotype(norm));
      }
      punnett.push(row);
    }
    return punnett;
  },

  /**
   * Count genotype frequencies from a flat punnett array (1D).
   * Returns [{genotype, count, fraction, percent}]
   */
  genotypeRatios(punnettFlat) {
    const counts = {};
    const total = punnettFlat.length;
    for (const g of punnettFlat) {
      counts[g] = (counts[g] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([genotype, count]) => ({
        genotype,
        count,
        fraction: count / total,
        percent: Math.round((count / total) * 100)
      }));
  },

  /**
   * Determine phenotype for a single-locus genotype string.
   * dominance: 'complete' | 'incomplete' | 'codominance'
   * Returns phenotype key: 'dom', 'rec', 'inter', 'A', 'B', 'AB', 'O'
   */
  getPhenotype(genotype, dominance, traitNames) {
    if (!genotype || genotype.length < 2) return 'unknown';
    const a1 = genotype[0];
    const a2 = genotype[1];
    const isUpper1 = a1 === a1.toUpperCase() && a1 !== a1.toLowerCase();
    const isUpper2 = a2 === a2.toUpperCase() && a2 !== a2.toLowerCase();
    const hasDom = isUpper1 || isUpper2;
    const bothRec = !isUpper1 && !isUpper2;

    if (dominance === 'complete') {
      if (hasDom) return 'dom';
      return 'rec';
    } else if (dominance === 'incomplete') {
      // Truly homozygous: both alleles are identical characters
      if (a1 === a2) {
        if (isUpper1) return 'dom';
        return 'rec';
      }
      return 'inter'; // heterozygous = intermediate
    } else if (dominance === 'codominance') {
      if (a1 === a2) {
        if (isUpper1) return 'dom';
        return 'rec';
      }
      return 'AB'; // both expressed
    }
    return 'dom';
  },

  /**
   * Count phenotype frequencies from flat punnett array.
   * Returns [{phenotype, label, count, fraction, percent, colorClass}]
   */
  phenotypeRatios(punnettFlat, dominance, traitNames) {
    const counts = {};
    const total = punnettFlat.length;

    for (const g of punnettFlat) {
      const pheno = this.getPhenotype(g, dominance, traitNames);
      counts[pheno] = (counts[pheno] || 0) + 1;
    }

    const colorMap = {
      'dom':   { class: 'pheno-dom',   color: '#d1fae5', textColor: '#065f46' },
      'rec':   { class: 'pheno-rec',   color: '#fee2e2', textColor: '#991b1b' },
      'inter': { class: 'pheno-inter', color: '#fef3c7', textColor: '#92400e' },
      'AB':    { class: 'pheno-ab',    color: '#fce7f3', textColor: '#9d174d' },
    };

    const labelMap = {
      'dom':   traitNames?.dominant   || t('genetics.dominant', 'Dominante'),
      'rec':   traitNames?.recessive  || t('genetics.recessive', 'Recesivo'),
      'inter': traitNames?.intermediate || t('genetics.intermediate', 'Intermedio'),
      'AB':    traitNames?.intermediate || ((traitNames?.dominant || 'A') + ' + ' + (traitNames?.recessive || 'B')),
    };

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([pheno, count]) => ({
        phenotype: pheno,
        label: labelMap[pheno] || pheno,
        count,
        fraction: count / total,
        percent: Math.round((count / total) * 100),
        colorClass: colorMap[pheno]?.class || 'pheno-dom',
        color: colorMap[pheno]?.color || '#e5e7eb',
        textColor: colorMap[pheno]?.textColor || '#374151',
      }));
  },

  /**
   * Dihybrid phenotype: uses both loci.
   * Returns one of: 'AB' (A_B_), 'Ab' (A_bb), 'aB' (aaB_), 'ab' (aabb)
   */
  getDihybridPhenotype(genotype) {
    // genotype like "AaBb", "AABb", "aabb", etc.
    if (!genotype || genotype.length < 4) return 'unknown';
    const a1 = genotype[0], a2 = genotype[1];
    const b1 = genotype[2], b2 = genotype[3];
    const hasA = (a1 === a1.toUpperCase() && a1 !== a1.toLowerCase()) ||
                 (a2 === a2.toUpperCase() && a2 !== a2.toLowerCase());
    const hasB = (b1 === b1.toUpperCase() && b1 !== b1.toLowerCase()) ||
                 (b2 === b2.toUpperCase() && b2 !== b2.toLowerCase());
    if (hasA && hasB)  return 'AB';
    if (hasA && !hasB) return 'Ab';
    if (!hasA && hasB) return 'aB';
    return 'ab';
  },

  /**
   * Dihybrid phenotype ratios from flat punnett.
   */
  dihybridPhenotypeRatios(punnettFlat, traitNames) {
    const counts = { AB: 0, Ab: 0, aB: 0, ab: 0 };
    const total = punnettFlat.length;
    for (const g of punnettFlat) {
      const pheno = this.getDihybridPhenotype(g);
      counts[pheno] = (counts[pheno] || 0) + 1;
    }
    const tn = traitNames || {};
    const labelMap = {
      AB: `${tn.domA || 'A_'} + ${tn.domB || 'B_'} (${tn.phAB || t('genetics.bothDominant', 'Ambos dominantes')})`,
      Ab: `${tn.domA || 'A_'} + ${tn.recB || 'bb'} (${tn.phAb || t('genetics.ADomBRec', 'A dominante, b recesivo')})`,
      aB: `${tn.recA || 'aa'} + ${tn.domB || 'B_'} (${tn.phaB || t('genetics.ARecBDom', 'a recesivo, B dominante')})`,
      ab: `${tn.recA || 'aa'} + ${tn.recB || 'bb'} (${tn.phab || t('genetics.bothRecessive', 'Ambos recesivos')})`,
    };
    const colorMap = {
      AB: { class: 'pheno-dom',   color: '#d1fae5', textColor: '#065f46' },
      Ab: { class: 'pheno-inter', color: '#fef3c7', textColor: '#92400e' },
      aB: { class: 'pheno-a',     color: '#dbeafe', textColor: '#1e3a8a' },
      ab: { class: 'pheno-rec',   color: '#fee2e2', textColor: '#991b1b' },
    };
    return Object.entries(counts)
      .filter(([, c]) => c > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([pheno, count]) => ({
        phenotype: pheno,
        label: labelMap[pheno] || pheno,
        count,
        fraction: count / total,
        percent: Math.round((count / total) * 100),
        colorClass: colorMap[pheno]?.class || '',
        color: colorMap[pheno]?.color || '#e5e7eb',
        textColor: colorMap[pheno]?.textColor || '#374151',
      }));
  },

  // ── X-Linked ────────────────────────────────────────────

  /**
   * Parse X-linked genotype string.
   * Supports: "X^AX^A", "X^AX^a", "X^aX^a", "X^AY", "X^aY"
   * Returns {type:'female'|'male', allele1:string, allele2:string|null}
   * allele1 is from first X, allele2 is from second X or 'Y'
   */
  parseXLinked(str) {
    if (!str) return null;
    str = str.trim();
    // Pattern: X^<allele>X^<allele> or X^<allele>Y
    const femaleMatch = str.match(/^X\^([A-Za-z\d]+)X\^([A-Za-z\d]+)$/);
    if (femaleMatch) {
      return { type: 'female', allele1: femaleMatch[1], allele2: femaleMatch[2] };
    }
    const maleMatch = str.match(/^X\^([A-Za-z\d]+)Y$/);
    if (maleMatch) {
      return { type: 'male', allele1: maleMatch[1], allele2: 'Y' };
    }
    // Simple fallback
    if (str.endsWith('Y')) {
      const allele = str.replace(/^X\^?/, '').replace('Y', '');
      return { type: 'male', allele1: allele || 'A', allele2: 'Y' };
    }
    return null;
  },

  /**
   * Generate X-linked gametes.
   * Female X^AX^a → ['X^A', 'X^a']
   * Male X^AY → ['X^A', 'Y']
   */
  generateXLinkedGametes(individual) {
    if (!individual) return [];
    if (individual.type === 'female') {
      return [`X^${individual.allele1}`, `X^${individual.allele2}`];
    } else {
      return [`X^${individual.allele1}`, 'Y'];
    }
  },

  /**
   * Build X-linked Punnett square.
   * Returns 2D array: punnett[i][j] = {genotype, type, phenoClass}
   */
  buildXLinkedPunnett(femaleGametes, maleGametes) {
    const punnett = [];
    for (const mg of maleGametes) {
      const row = [];
      for (const fg of femaleGametes) {
        let genotype, type, isMale;
        if (mg === 'Y') {
          // Male offspring: X^? + Y
          genotype = fg + 'Y';
          isMale = true;
        } else {
          // Female offspring: X^? + X^?
          genotype = fg + mg;
          isMale = false;
        }
        row.push({ genotype, isMale });
      }
      punnett.push(row);
    }
    return punnett;
  },

  /**
   * Get X-linked phenotype info.
   * genotype like "X^AX^a", "X^aX^a", "X^AY", "X^aY"
   * Returns 'normal_female' | 'carrier_female' | 'affected_female' | 'normal_male' | 'affected_male'
   */
  getXLinkedPhenotype(genotypeStr, dominantAllele) {
    dominantAllele = dominantAllele || 'A';
    const recAllele = dominantAllele.toLowerCase();

    if (genotypeStr.endsWith('Y')) {
      // Male
      const allele = genotypeStr.match(/X\^([A-Za-z\d]+)Y/)?.[1];
      if (!allele) return 'unknown';
      if (allele === dominantAllele) return 'normal_male';
      return 'affected_male';
    } else {
      // Female: X^?X^?
      const m = genotypeStr.match(/X\^([A-Za-z\d]+)X\^([A-Za-z\d]+)/);
      if (!m) return 'unknown';
      const a1 = m[1], a2 = m[2];
      if (a1 === dominantAllele && a2 === dominantAllele) return 'normal_female';
      if ((a1 === dominantAllele && a2 === recAllele) ||
          (a1 === recAllele && a2 === dominantAllele)) return 'carrier_female';
      if (a1 === recAllele && a2 === recAllele) return 'affected_female';
      return 'normal_female';
    }
  },

  // ── Utility ─────────────────────────────────────────────

  /**
   * Convert fraction to simple ratio string.
   * 0.5 → "1/2", 0.25 → "1/4", 0.75 → "3/4"
   */
  fractionToRatio(fraction) {
    const denominators = [2, 4, 8, 16, 3, 6];
    for (const d of denominators) {
      const n = Math.round(fraction * d);
      if (Math.abs(n / d - fraction) < 0.001) {
        if (n === d) return '1';
        return `${n}/${d}`;
      }
    }
    return `${Math.round(fraction * 100)}%`;
  },

  /**
   * Build a human-readable ratio string from phenotype ratios.
   * e.g. "3 Amarillo : 1 Verde"
   */
  buildRatioString(ratios) {
    // Find minimum count to express as ratio
    const counts = ratios.map(r => r.count);
    const gcd = counts.reduce((a, b) => {
      while (b) { [a, b] = [b, a % b]; }
      return a;
    });
    return ratios
      .map(r => `${r.count / gcd} ${r.label}`)
      .join(' : ');
  }
};

// Make available globally
window.Genetics = Genetics;

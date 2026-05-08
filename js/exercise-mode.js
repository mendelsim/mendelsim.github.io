/**
 * MendelSim — shared teacher/student exercise helpers.
 */
(function () {
  function escapeHTML(text) {
    return String(text || '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[ch]));
  }

  function formatGenotypeHTML(text) {
    return escapeHTML(text).replace(/([A-Za-z])\^([A-Za-z0-9]+)/g, '$1<sup>$2</sup>');
  }

  function safeFilename(text, fallback = 'ejercicio-mendelsim') {
    return (text || fallback)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || fallback;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function encodeData(data) {
    const bytes = new TextEncoder().encode(JSON.stringify(data));
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function decodeData(encoded) {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - encoded.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function switchTab(name, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));
    const tab = document.getElementById('tab-' + name);
    if (tab) tab.classList.add('active');
    const activeButton = btn || document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (activeButton) activeButton.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showStudentTab(studentOnly = false) {
    const btn = document.getElementById('studentTabBtn');
    if (btn) btn.style.display = '';
    const tabs = document.querySelector('.tabs');
    if (tabs) {
      tabs.classList.remove('student-only-tabs');
      tabs.style.display = '';
    }
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.style.display = '';
    });
    switchTab('alumno', btn);
  }

  function showStudentEmpty(title = t('exercise.defaultTitle', 'Actividad MendelSim')) {
    const titleEl = document.getElementById('studentExerciseTitle');
    if (titleEl) titleEl.textContent = title;
    const promptBox = document.getElementById('studentExercisePrompt');
    const promptText = document.getElementById('studentExercisePromptText');
    if (promptBox) promptBox.style.display = '';
    if (promptText) {
      promptText.textContent = t('exercise.loadFromProfessor', 'Abre el enlace que te ha dado tu profesor/a o carga el archivo JSON de actividad.');
    }
    const meta = document.getElementById('studentExerciseMeta');
    if (meta) meta.innerHTML = '';
    const sections = document.getElementById('studentAnswerSections');
    if (sections) {
      sections.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">📂</span><div>${t('exercise.noActivityLoaded', 'No hay actividad cargada. Usa el botón para cargar un archivo JSON de actividad.')}</div></div>`;
    }
    const checkBtn = document.getElementById('studentCheckBtn');
    if (checkBtn) checkBtn.disabled = true;
    const note = document.getElementById('studentAutoCheckNote');
    if (note) note.textContent = t('exercise.noActivityLoadedNote', 'Todavía no hay una actividad cargada.');
    updateExportButtons();
  }

  function setStatus(id, message, type = '') {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = type ? `exercise-status ${type}` : 'exercise-status';
    el.textContent = message || '';
    if (message) {
      clearTimeout(setStatus._timer);
      setStatus._timer = setTimeout(() => { el.textContent = ''; }, 5000);
    }
  }

  async function copyText(text, fallbackPrompt, onSuccess) {
    try {
      await navigator.clipboard.writeText(text);
      if (onSuccess) onSuccess();
    } catch (err) {
      prompt(fallbackPrompt || 'Copia este texto:', text);
      if (onSuccess) onSuccess();
    }
  }

  function readJSONFile(event, callback) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        callback(JSON.parse(reader.result), file.name);
      } catch (err) {
        alert(err.message || 'No se pudo leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  }

  function countToPercent(count, total) {
    if (!total) return 0;
    return Math.round((Number(count) / Number(total)) * 100);
  }

  function buildRatioString(rows) {
    const counts = rows.map(row => row.count).filter(count => count > 0);
    if (!counts.length) return '0';
    const gcd = counts.reduce((a, b) => {
      while (b) [a, b] = [b, a % b];
      return a;
    });
    return rows
      .filter(row => row.count > 0)
      .map(row => `${row.count / gcd} ${row.label}`)
      .join(' : ');
  }

  function renderStudentActivity(data, solution, options = {}) {
    const title = data.metadata?.title || options.defaultTitle || t('exercise.defaultTitle', 'Actividad MendelSim');
    const prompt = data.metadata?.prompt || '';
    const meta = data.metadata || {};

    document.getElementById('studentExerciseTitle').textContent = title;
    const promptBox = document.getElementById('studentExercisePrompt');
    const promptText = document.getElementById('studentExercisePromptText');
    if (prompt) {
      promptBox.style.display = '';
      promptText.innerHTML = formatGenotypeHTML(prompt).replace(/\n/g, '<br>');
    } else {
      promptBox.style.display = 'none';
      promptText.innerHTML = '';
    }

    const metaItems = [];
    if (meta.trait) metaItems.push(`<div class="student-meta-item"><strong>${t('exercise.trait', 'Rasgo')}</strong><br>${escapeHTML(meta.trait)}</div>`);
    if (meta.crossLabel) metaItems.push(`<div class="student-meta-item"><strong>${t('exercise.cross', 'Cruce')}</strong><br>${formatGenotypeHTML(meta.crossLabel)}</div>`);
    if (meta.inheritance) metaItems.push(`<div class="student-meta-item"><strong>${t('exercise.model', 'Modelo')}</strong><br>${escapeHTML(meta.inheritance)}</div>`);
    document.getElementById('studentExerciseMeta').innerHTML = metaItems.join('');

    const form = document.getElementById('studentAnswerSections');
    form.innerHTML = '';
    solution.sections.forEach(section => {
      const tableRows = section.rows.map(row => `
        <tr>
          <td>${formatGenotypeHTML(row.label)}</td>
          <td><input type="number" min="0" max="${section.total}" step="1" data-section="${section.id}" data-key="${escapeHTML(row.key)}" class="student-count-input" placeholder="0"></td>
          <td class="exercise-total">/ ${section.total}</td>
        </tr>
      `).join('');
      form.innerHTML += `
        <div class="exercise-answer-section">
          <div class="section-title">${escapeHTML(section.title)}</div>
          <table class="exercise-answer-table">
            <thead><tr><th>${t('exercise.result', 'Resultado')}</th><th>${t('exercise.cases', 'Casos')}</th><th>${t('exercise.total', 'Total')}</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      `;
    });

    document.getElementById('studentName').value = '';
    document.getElementById('studentJustification').value = '';
    const feedback = document.getElementById('studentFeedback');
    feedback.className = 'alert student-feedback';
    feedback.innerHTML = '';
    const autoCheck = !!data.assignment?.allowAutoCheck && !!data.solution;
    const checkBtn = document.getElementById('studentCheckBtn');
    if (checkBtn) checkBtn.disabled = !autoCheck;
    document.getElementById('studentAutoCheckNote').textContent = autoCheck
      ? t('exercise.autoCheckEnabled', 'El profesor ha activado la autocorrección para esta actividad.')
      : t('exercise.autoCheckDisabled', 'El profesor no ha activado la autocorrección. Completa la respuesta y envíala.');
    updateExportButtons();
  }

  function collectStudentAnswers(solution) {
    const counts = {};
    document.querySelectorAll('.student-count-input').forEach(input => {
      const section = input.dataset.section;
      const key = input.dataset.key;
      if (!counts[section]) counts[section] = {};
      counts[section][key] = input.value === '' ? null : Number(input.value);
    });
    return {
      type: 'mendelsim-cross-answer',
      version: 1,
      studentName: document.getElementById('studentName')?.value.trim() || '',
      justification: document.getElementById('studentJustification')?.value.trim() || '',
      counts,
      summary: solution.sections.map(section => ({
        title: section.title,
        rows: section.rows.map(row => ({
          label: row.label,
          count: counts[section.id]?.[row.key],
          total: section.total,
        })),
      })),
      sentAt: new Date().toISOString(),
    };
  }

  function checkStudentAnswers(solution) {
    const answer = collectStudentAnswers(solution);
    let correct = 0;
    let total = 0;
    const lines = [];
    solution.sections.forEach(section => {
      lines.push(`<p><strong>${escapeHTML(section.title)}</strong></p>`);
      section.rows.forEach(row => {
        total++;
        const value = answer.counts[section.id]?.[row.key];
        const ok = Number(value) === Number(row.count);
        if (ok) correct++;
        lines.push(`<p><span class="${ok ? 'check-ok' : 'check-error'}">${ok ? '✓' : '✗'}</span> ${formatGenotypeHTML(row.label)}: ${value ?? t('exercise.notAnswered', '(sin responder)')} / ${section.total}${ok ? '' : `; ${t('exercise.reference', 'referencia')}: ${row.count} / ${section.total} (${countToPercent(row.count, section.total)}%)`}</p>`);
      });
    });

    const feedback = document.getElementById('studentFeedback');
    feedback.className = `alert student-feedback visible ${correct === total ? 'alert-success' : 'alert-warning'}`;
    feedback.innerHTML = `<p><strong>${t('exercise.checkResult', 'Resultado:')}</strong> ${correct}/${total} ${t('exercise.correctAnswers', 'respuestas correctas.')}</p>${lines.join('')}`;
  }

  function formatAnswersText(data, solution) {
    const answer = collectStudentAnswers(solution);
    const lines = [
      `${t('exercise.activity', 'Activitat')}: ${data.metadata?.title || t('exercise.defaultTitle', 'Actividad MendelSim')}`,
      `${t('exercise.studentLabel', 'Alumno/a')}: ${answer.studentName || t('exercise.noName', '(sin nombre)')}`,
      `${t('exercise.dateLabel', 'Fecha y hora')}: ${formatDateTime()}`,
      '',
      `${t('exercise.answers', 'Respuestas')}:`,
    ];
    answer.summary.forEach(section => {
      lines.push(`\n${section.title}`);
      section.rows.forEach(row => {
        lines.push(`- ${row.label}: ${row.count ?? t('exercise.notAnswered', '(sin responder)')} / ${row.total}`);
      });
    });
    lines.push('', `${t('exercise.justification', 'Justificación')}:`, answer.justification || t('exercise.notAnswered', '(sin responder)'));
    return lines.join('\n');
  }

  function updateExportButtons() {
    const name = document.getElementById('studentName')?.value.trim() || '';
    const disabled = !name;
    document.querySelectorAll('.student-export-btn').forEach(btn => {
      btn.disabled = disabled;
    });
  }

  function formatDateTime() {
    const now = new Date();
    const locale = window.MendelSimI18n?.getLocale() || 'es';
    const localeMap = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' };
    const lc = localeMap[locale] || locale;
    const date = now.toLocaleDateString(lc, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString(lc, { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  }

  function printStudentAnswers(data, solution) {
    const answer = collectStudentAnswers(solution);
    const studentName = answer.studentName || '';
    if (!studentName) {
      alert(t('exercise.printNoName', 'Escribe tu nombre antes de imprimir.'));
      document.getElementById('studentName')?.focus();
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(t('exercise.printBlocked', 'No se pudo abrir la ventana de impresión. Comprueba si el navegador bloquea las ventanas emergentes.'));
      return;
    }

    const title   = escapeHTML(data?.metadata?.title || t('exercise.defaultTitle', 'Actividad MendelSim'));
    const prompt  = data?.metadata?.prompt || '';
    const meta    = data?.metadata || {};
    const dateStr = escapeHTML(formatDateTime());
    const locale  = window.MendelSimI18n?.getLocale() || 'es';

    const metaRows = [];
    if (meta.trait)      metaRows.push(`<p><strong>${t('exercise.trait', 'Rasgo')}:</strong> ${escapeHTML(meta.trait)}</p>`);
    if (meta.crossLabel) metaRows.push(`<p><strong>${t('exercise.cross', 'Cruce')}:</strong> ${formatGenotypeHTML(meta.crossLabel)}</p>`);
    if (meta.inheritance)metaRows.push(`<p><strong>${t('exercise.model', 'Modelo')}:</strong> ${escapeHTML(meta.inheritance)}</p>`);
    if (prompt)          metaRows.push(`<p><strong>${t('exercise.statement', 'Enunciado')}:</strong> ${formatGenotypeHTML(prompt).replace(/\n/g, '<br>')}</p>`);

    const sectionHTML = answer.summary.map(section => {
      const rows = section.rows.map(row => {
        const val = row.count !== null && row.count !== undefined ? row.count : '—';
        const pct = (row.total && row.count !== null && row.count !== undefined)
          ? ` <span class="pct">(${Math.round(row.count / row.total * 100)}%)</span>` : '';
        return `<tr><td>${formatGenotypeHTML(row.label)}</td><td class="answer-cell">${val} / ${row.total}${pct}</td></tr>`;
      }).join('');
      return `<div class="answer-section">
        <p class="section-title">${escapeHTML(section.title)}</p>
        <table class="answer-table"><tbody>${rows}</tbody></table>
      </div>`;
    }).join('');

    const justification = escapeHTML(answer.justification || '').replace(/\n/g, '<br>');

    printWindow.document.write(`<!DOCTYPE html>
<html lang="${escapeHTML(locale)}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    :root{--green:#1a7431;--green-light:#e8f5e9;--border:#cde0cd;--text:#2c3e50;--font:Inter,Arial,sans-serif;--mono:Consolas,monospace;}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:var(--font);color:var(--text);font-size:13px;padding:20px 28px;}
    .header{border-bottom:2px solid var(--green);padding-bottom:10px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px;}
    .header h1{font-size:18px;color:var(--green);line-height:1.2;}
    .header .app{font-size:11px;color:#6b7280;text-align:right;white-space:nowrap;}
    .student-box{background:var(--green-light);border:1px solid var(--border);border-radius:6px;padding:8px 12px;margin-bottom:14px;display:flex;gap:24px;flex-wrap:wrap;align-items:center;}
    .student-box .field{display:flex;flex-direction:column;gap:2px;}
    .student-box .label{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#4b5563;}
    .student-box .value{font-size:14px;font-weight:700;color:var(--green);}
    .meta{font-size:12px;margin-bottom:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:5px;padding:8px 12px;}
    .meta p{margin:3px 0;}
    .section-title{font-weight:700;color:var(--green);margin:12px 0 4px;}
    .answer-table{border-collapse:collapse;width:100%;max-width:420px;font-size:12px;margin-bottom:8px;}
    .answer-table td{padding:4px 10px;border-bottom:1px solid #e5e7eb;}
    .answer-table td:first-child{color:#374151;}
    .answer-cell{font-weight:600;text-align:right;min-width:80px;}
    .pct{font-weight:400;color:#6b7280;font-size:11px;}
    .justification-box{margin-top:14px;border-top:1px solid var(--border);padding-top:10px;}
    .justification-box .label{font-weight:700;color:var(--green);margin-bottom:4px;}
    .justification-text{font-size:12px;line-height:1.6;min-height:40px;color:#374151;}
    code{font-family:var(--mono);color:#14532d;font-weight:600;}
    sup{font-size:0.75em;vertical-align:super;}
    @media print{
      body{padding:10mm 14mm;}
      .header h1{font-size:15px;}
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <div class="app">MendelSim</div>
  </div>
  <div class="student-box">
    <div class="field">
      <span class="label">${t('exercise.studentLabel', 'Alumno/a')}</span>
      <span class="value">${escapeHTML(studentName)}</span>
    </div>
    <div class="field">
      <span class="label">${t('exercise.dateLabel', 'Fecha y hora')}</span>
      <span class="value">${dateStr}</span>
    </div>
  </div>
  ${metaRows.length ? `<div class="meta">${metaRows.join('')}</div>` : ''}
  ${sectionHTML}
  <div class="justification-box">
    <div class="label">${t('exercise.justification', 'Justificación')}</div>
    <div class="justification-text">${justification || '<span style="color:#9ca3af">—</span>'}</div>
  </div>
  <script>window.addEventListener('load',()=>{window.focus();window.print();});<\/script>
</body>
</html>`);
    printWindow.document.close();
  }

  function loadFromHash(callback) {
    const match = location.hash.match(/^#actividad=(.+)$/);
    if (!match) return false;
    try {
      callback(decodeData(match[1]), 'URL compartida');
      return true;
    } catch (err) {
      console.error(err);
      alert(t('exercise.urlError', 'No se pudo leer la actividad desde la URL.'));
      return false;
    }
  }

  window.MendelSimExercises = {
    escapeHTML,
    formatGenotypeHTML,
    safeFilename,
    downloadBlob,
    encodeData,
    decodeData,
    switchTab,
    showStudentTab,
    showStudentEmpty,
    setStatus,
    copyText,
    readJSONFile,
    countToPercent,
    buildRatioString,
    renderStudentActivity,
    collectStudentAnswers,
    checkStudentAnswers,
    formatAnswersText,
    printStudentAnswers,
    updateExportButtons,
    loadFromHash,
  };
})();

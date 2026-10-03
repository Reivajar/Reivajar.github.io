// Publication filters, chart grouping and hover info. The page reads without JavaScript.
(function () {
  var chips = document.querySelectorAll('.chip');
  var items = document.querySelectorAll('.pub');

  function applyFilter(filter) {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === filter)); });
    items.forEach(function (li) {
      var show = filter === 'all' ||
        (filter === 'selected' ? li.dataset.selected === '1' : li.dataset.type === filter);
      li.hidden = !show;
    });
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { applyFilter(c.dataset.filter); }); });

  function revealTarget() {
    var id = location.hash.slice(1);
    var el = id && document.getElementById(id);
    if (el && el.hidden) applyFilter('all');
  }
  window.addEventListener('hashchange', revealTarget);
  revealTarget();

  // chart: group by type or by topic
  var seg = document.querySelectorAll('.seg-btn');
  var charts = document.querySelectorAll('svg.dots');
  seg.forEach(function (b) {
    b.addEventListener('click', function () {
      seg.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      charts.forEach(function (c) {
        if (c.dataset.mode === b.dataset.mode) c.removeAttribute('hidden'); else c.setAttribute('hidden', '');
      });
      hideTip();
    });
  });

  // hover and focus info box
  var tip = document.getElementById('tip');
  var dataEl = document.getElementById('pubdata');
  var pubs = dataEl ? JSON.parse(dataEl.textContent) : {};
  var active = null;

  function showTip(a) {
    var p = pubs[a.dataset.id];
    if (!p || !tip) return;
    tip.innerHTML = '';
    var t = document.createElement('span'); t.className = 't'; t.textContent = p.title;
    var m = document.createElement('span'); m.className = 'm';
    m.textContent = [p.authors, p.venue, p.year].filter(Boolean).join(', ');
    var k = document.createElement('span'); k.className = 'm';
    k.textContent = p.type + ' | ' + p.topic + (p.selected ? ' | Selected' : '');
    tip.appendChild(t); tip.appendChild(m); tip.appendChild(k);
    tip.hidden = false;
    var r = a.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    var x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
    var y = r.top - h - 10;
    if (y < 8) y = r.bottom + 10;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    if (active) active.classList.remove('active');
    active = a; a.classList.add('active');
  }
  function hideTip() {
    if (tip) tip.hidden = true;
    if (active) { active.classList.remove('active'); active = null; }
  }

  document.querySelectorAll('.dots a').forEach(function (a) {
    a.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') showTip(a); });
    a.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') hideTip(); });
    a.addEventListener('focus', function () { showTip(a); });
    a.addEventListener('blur', hideTip);
    // touch: first tap shows the info, second tap follows the link
    a.addEventListener('click', function (e) {
      if (e.pointerType === 'touch' || (window.matchMedia && matchMedia('(hover: none)').matches)) {
        if (active !== a) { e.preventDefault(); showTip(a); }
      }
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); });
  window.addEventListener('scroll', hideTip, { passive: true });
})();

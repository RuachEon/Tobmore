document.addEventListener('DOMContentLoaded', () => {
  const placeholder = (cat, n) => `assets/images/${cat}/${cat}${n}.jpg`;
  const data = {
    youtube: Array.from({length:10},(_,i)=>placeholder('youtube', i+1)),
    twitch: Array.from({length:10},(_,i)=>placeholder('twitch', i+1)),
    kick: Array.from({length:10},(_,i)=>placeholder('kick', i+1)),
    spotify: Array.from({length:10},(_,i)=>placeholder('spotify', i+1)),
  };
  const tabs = document.querySelectorAll('.tab');
  const gallery = document.getElementById('gallery');
  const yearEl = document.getElementById('year');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', ()=> navLinks.classList.toggle('show'));
    document.addEventListener('click', (e)=> {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) navLinks.classList.remove('show');
    });
  }
  function clearGallery() {
    gallery.innerHTML = `<div class="gallery-empty">Choose a platform to view projects.</div>`;
  }
  function createCard(src, caption) {
    const fig = document.createElement('figure');
    fig.className = 'card';
    const img = document.createElement('img');
    img.src = src;
    img.alt = caption;
    img.loading = 'lazy';
    const cap = document.createElement('figcaption');
    cap.textContent = caption;
    fig.appendChild(img);
    fig.appendChild(cap);
    img.addEventListener('click', ()=> openLightbox(src, caption));
    return fig;
  }
  function loadCategory(cat) {
    gallery.innerHTML = '';
    const arr = data[cat] || [];
    if (arr.length === 0) {
      gallery.innerHTML = `<div class="gallery-empty">No projects for ${cat}.</div>`;
      return;
    }
    arr.forEach((src, idx) => {
      const caption = `${cat.charAt(0).toUpperCase()+cat.slice(1)} Project ${idx+1}`;
      const card = createCard(src, caption);
      gallery.appendChild(card);
      setTimeout(()=> card.classList.add('visible'), 60 * idx);
    });
  }
  tabs.forEach(tab=> {
    tab.addEventListener('click', ()=> {
      document.querySelector('.tab.active')?.classList.remove('active');
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      tabs.forEach(t=> t.setAttribute('aria-selected', t===tab? 'true':'false'));
      loadCategory(cat);
      document.querySelector('#portfolio').scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  clearGallery();
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  function openLightbox(src, caption='') {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    lightboxBackdrop.hidden = false;
    lightbox.style.display = 'block';
    lightboxBackdrop.style.display = 'block';
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxBackdrop.hidden = true;
    lightbox.style.display = 'none';
    lightboxBackdrop.style.display = 'none';
    lightboxImg.src = '';
    lightboxCaption.textContent = '';
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeLightbox(); });
  document.addEventListener('keydown', (e)=>{
    if (['ArrowLeft','ArrowRight'].includes(e.key)) {
      const tabsArr = Array.from(tabs);
      const activeIndex = tabsArr.findIndex(t=> t.classList.contains('active'));
      if (activeIndex >= 0) {
        const newIndex = e.key==='ArrowLeft' ? Math.max(0, activeIndex-1) : Math.min(tabsArr.length-1, activeIndex+1);
        tabsArr[newIndex].click();
      }
    }
  });
});
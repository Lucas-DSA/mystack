  // Scroll reveal for each section
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.15});
  revealEls.forEach(el=>revealObserver.observe(el));

  // Floating CTA: show after scrolling past the hero
  const floatCta = document.getElementById('float-cta');
  const heroEl = document.getElementById('hero');
  if(floatCta && heroEl){
    const ctaObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        floatCta.classList.toggle('show', !entry.isIntersecting);
      });
    }, {threshold:0});
    ctaObserver.observe(heroEl);
  }

  // Nav logo: typewriter write/erase loop, preserving colored dot
  (function typewriterLogo(){
    const el = document.getElementById('logo-text');
    if(!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // segments: text + optional class (accent word gets teal color)
    const segments = [
      {t:'Lucas ', cls:''},
      {t:'Alves', cls:'dot'}
    ];
    // flatten into an array of {ch, cls}
    const chars = [];
    segments.forEach(seg=>{
      [...seg.t].forEach(ch=> chars.push({ch, cls:seg.cls}));
    });

    if(prefersReduced){
      chars.forEach(c=>{
        const span = document.createElement('span');
        if(c.cls) span.className = c.cls;
        span.textContent = c.ch;
        el.appendChild(span);
      });
      return;
    }

    let i = 0;
    let deleting = false;

    function render(){
      el.innerHTML = '';
      for(let k=0; k<i; k++){
        const c = chars[k];
        const span = document.createElement('span');
        if(c.cls) span.className = c.cls;
        span.textContent = c.ch;
        el.appendChild(span);
      }
    }

    function tick(){
      if(!deleting){
        i++;
        render();
        if(i === chars.length){
          deleting = true;
          setTimeout(tick, 2200); // pause on full name
          return;
        }
        setTimeout(tick, 130);
      } else {
        i--;
        render();
        if(i === 0){
          deleting = false;
          setTimeout(tick, 500); // pause before retyping
          return;
        }
        setTimeout(tick, 70);
      }
    }
    tick();
  })();

  // Animate hero heading letters (wave float effect), preserving word wrapping
  (function animateHeroLetters(){
    const h1 = document.querySelector('.hero h1');
    if(!h1) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced) return;

    let globalIndex = 0;
    const DELAY_STEP = 0.035; // seconds between each letter's animation offset
    const DURATION = 3.2;

    function wrapTextNode(node){
      const words = node.textContent.split(' ');
      const frag = document.createDocumentFragment();
      words.forEach((word, wIdx)=>{
        [...word].forEach(ch=>{
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = ch;
          span.style.animationDelay = (globalIndex * DELAY_STEP) + 's';
          span.style.animationDuration = DURATION + 's';
          globalIndex++;
          frag.appendChild(span);
        });
        if(wIdx < words.length - 1){
          frag.appendChild(document.createTextNode(' '));
        }
      });
      return frag;
    }

    [...h1.childNodes].forEach(node=>{
      if(node.nodeType === Node.TEXT_NODE){
        h1.replaceChild(wrapTextNode(node), node);
      } else if(node.nodeType === Node.ELEMENT_NODE){
        // e.g. the .accent span — wrap its own text, keep the element as color wrapper
        [...node.childNodes].forEach(inner=>{
          if(inner.nodeType === Node.TEXT_NODE){
            node.replaceChild(wrapTextNode(inner), inner);
          }
        });
      }
    });
  })();

  // Project filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card');
  const emptyMsg = document.getElementById('empty-msg');

  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      let visibleCount = 0;
      cards.forEach(card=>{
        const match = f === 'TODOS' || card.dataset.cat === f;
        card.style.display = match ? 'flex' : 'none';
        if(match) visibleCount++;
      });
      emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });

  // Animate skill bars when visible
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.width = entry.target.dataset.pct + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.4});
  bars.forEach(b=>barObserver.observe(b));

  // Contact form -> WhatsApp (canal real disponível no perfil)
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const nome = data.get('nome') || '';
    const email = data.get('email') || '';
    const assunto = data.get('assunto') || 'Contato pelo portfólio';
    const mensagem = data.get('mensagem') || '';
    const text = `Olá! Me chamo ${nome} (${email}).\nAssunto: ${assunto}\n\n${mensagem}`;
    window.open(`https://wa.me/5511954239701?text=${encodeURIComponent(text)}`, '_blank');
  });

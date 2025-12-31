// ========================================
// Navigation Scroll Effect
// ========================================
const nav = document.getElementById('main-nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Add scroll effect to navigation
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ========================================
// Smooth Scroll
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Intersection Observer for Scroll Animations
// ========================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// ========================================
// Active Navigation Link Highlighting
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// Lazy Loading for Images (if real images are added)
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Parallax Effect for Hero Section (Disabled for stability)
// ========================================
// Commented out to prevent animation conflicts with hero text
/*
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    if (hero && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.2;
    }
});
*/

// ========================================
// Add hover effect to info cards
// ========================================
document.querySelectorAll('.info-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// Animated Counter (if needed for statistics)
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ========================================
// Page Load Animation
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Add initial animation to hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

// ========================================
// External Link Handler
// ========================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function (e) {
        // Add any analytics or tracking here if needed
    });
});

// ========================================
// Prevent Default Scroll Restoration
// ========================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// ========================================
// Add smooth reveal on scroll for cards
// ========================================
const cards = document.querySelectorAll('.menu-card, .info-card, .news-item');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});
// ===== microCMS 設定（ここだけ自分の値に変更）=====
const MICROCMS_SERVICE_DOMAIN = "testkitchenh";
const MICROCMS_API_KEY = "SwGhVyiu249eg4vcbtaBy5KmAKaeDBRmt53F";
const ENDPOINT = "news"; // 作ったエンドポイント

// ===== お知らせ取得 =====
async function fetchNews() {
  const url = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}?limit=5`;

  const res = await fetch(url, {
    headers: {
      "X-MICROCMS-API-KEY": MICROCMS_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`microCMS API error: ${res.status}`);
  }

  return res.json();
}

// ===== HTMLに表示 =====
function renderNews(contents) {
  const container = document.getElementById("news-list");
  if (!container) return;

  if (!contents || contents.length === 0) {
    container.innerHTML = "<p>お知らせはありません。</p>";
    return;
  }

  const html = contents
    .map((item) => {
      const date = item.date ? new Date(item.date).toLocaleDateString("ja-JP") : "";
      const title = item.title ?? "(no title)";
      const body = item.body ?? "";

      return `
        <article style="border-bottom: 1px solid #ddd; padding: 12px 0;">
          <div style="font-size: 14px; color: #666;">${date}</div>
          <div style="font-size: 18px; font-weight: 700; margin: 6px 0;">${title}</div>
          <div style="line-height: 1.7;">${body}</div>
        </article>
      `;
    })
    .join("");

  container.innerHTML = html;
}

// ===== 実行 =====
(async () => {
  try {
    const data = await fetchNews();
    renderNews(data.contents);
  } catch (err) {
    console.error(err);
    const container = document.getElementById("news-list");
    if (container) container.innerHTML = "<p>お知らせの読み込みに失敗しました。</p>";
  }
})();


console.log('TEST KITCHEN H - Website Loaded Successfully ✨');

/*
 * The Yak Pen — Wrangle Your Chaos
 * Based on Tooplate 2141 Minimal White
 */

// ============================================
// CURATED REDDIT POSTS
// To switch to dynamic: replace this with a fetch() call
// ============================================

const CURATED_POSTS = [
    {
        title: "I just wanted to add a favicon and ended up rebuilding my entire CI/CD pipeline",
        url: "https://reddit.com/r/theyakpen/comments/example1",
        votes: 42,
        comments: 18
    },
    {
        title: "3-hour yak shave: Tried to print a PDF, discovered my printer driver was for a different architecture",
        url: "https://reddit.com/r/theyakpen/comments/example2",
        votes: 87,
        comments: 34
    },
    {
        title: "Started the day wanting to rename a variable. Ended up migrating to a new database.",
        url: "https://reddit.com/r/theyakpen/comments/example3",
        votes: 156,
        comments: 52
    }
];

// Set to true to use live Reddit feed (when subreddit is public)
const USE_DYNAMIC_FEED = false;
const SUBREDDIT = 'theyakpen';

// ============================================
// POSTS RENDERING
// ============================================

function renderPosts(posts) {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;

    if (!posts || posts.length === 0) {
        grid.innerHTML = `
            <div class="post-card" style="grid-column: 1 / -1; text-align: center;">
                <p>The herd is gathering... Check back soon for community stories.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3><a href="${post.url}" target="_blank" rel="noopener">${escapeHtml(post.title)}</a></h3>
            <div class="post-meta">
                <span>▲ ${post.votes}</span>
                <span>💬 ${post.comments}</span>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function fetchRedditPosts() {
    try {
        const response = await fetch(`https://www.reddit.com/r/${SUBREDDIT}/hot.json?limit=5`);
        const data = await response.json();
        
        return data.data.children
            .filter(child => !child.data.stickied)
            .slice(0, 3)
            .map(child => ({
                title: child.data.title,
                url: `https://reddit.com${child.data.permalink}`,
                votes: child.data.score,
                comments: child.data.num_comments
            }));
    } catch (error) {
        console.error('Failed to fetch Reddit posts:', error);
        return null;
    }
}

async function loadPosts() {
    if (USE_DYNAMIC_FEED) {
        const posts = await fetchRedditPosts();
        renderPosts(posts || CURATED_POSTS); // Fallback to curated if fetch fails
    } else {
        renderPosts(CURATED_POSTS);
    }
}

// ============================================
// NAVIGATION
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================

const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    
    // Navbar style on scroll
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active menu highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Trigger scroll event on load to set initial active state
window.dispatchEvent(new Event('scroll'));

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// FADE-IN ANIMATION ON SCROLL
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ============================================
// FORM SUBMISSION
// ============================================

const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // TODO: Replace with actual form submission
        alert('Thanks for reaching out! We\'ll be in touch soon.');
        this.reset();
    });
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
});

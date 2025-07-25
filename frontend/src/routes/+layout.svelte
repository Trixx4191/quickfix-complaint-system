<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let scroll;
  let isScrolled = false;

  // Scroll to section by ID
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  onMount(async () => {
    if (!browser) return;

    // Watch scroll to toggle navbar background
    window.addEventListener('scroll', () => {
      isScrolled = window.scrollY > 50;
    });

    // Dynamically import locomotive-scroll
    const LocomotiveScroll = (await import('locomotive-scroll')).default;

    // Wait for DOM to be ready before initializing
    requestAnimationFrame(() => {
      scroll = new LocomotiveScroll({
        el: document.querySelector('#smooth-wrapper'),
        smooth: true
      });

      scroll.scrollTo(0, { duration: 0 });
    });
  });
</script>

<!-- Sticky Transparent Navbar -->
<nav class:isScrolled>
  <div class="nav-content">
    <h1 class="logo" on:click={() => scrollToSection('hero')}>QuickFix</h1>
    <div class="nav-links">
      <a on:click={() => scrollToSection('about')}>About</a>
      <a on:click={() => scrollToSection('how')}>How it Works</a>
      <a href="/login">Login</a>
    </div>
  </div>
</nav>

<!-- Smooth Scroll Container -->
<div id="smooth-wrapper" data-scroll-container>
  <slot />
</div>

<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #smooth-wrapper {
    min-height: 100vh;
    overflow: hidden;
  }

  nav {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(10, 10, 10, 0.5);
    backdrop-filter: blur(10px);
    color: white;
    padding: 1rem 2rem;
    z-index: 1000;
    transition: background 0.3s ease;
  }

  nav.isScrolled {
    background: rgba(0, 0, 0, 0.85);
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.5rem;
    cursor: pointer;
    font-weight: bold;
  }

  .nav-links a {
    margin-left: 1.5rem;
    cursor: pointer;
    text-decoration: none;
    color: white;
    font-weight: 500;
  }

  .nav-links a:hover {
    color: #0af;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { user } from '../stores/user.js'; // adjust path if needed

  let scroll;
  let isScrolled = false;
  let menuOpen = false;

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      menuOpen = false; // Close menu after clicking link
    }
  }

  onMount(async () => {
    if (!browser) return;

    const saved = localStorage.getItem('user');
    if (saved) user.set(JSON.parse(saved));

    window.addEventListener('scroll', () => {
      isScrolled = window.scrollY > 50;
    });

    const LocomotiveScroll = (await import('locomotive-scroll')).default;
    requestAnimationFrame(() => {
      scroll = new LocomotiveScroll({
        el: document.querySelector('#smooth-wrapper'),
        smooth: true
      });
      scroll.scrollTo(0, { duration: 0 });
    });
  });
</script>

<nav class:isScrolled>
  <div class="nav-content">
    <h1 class="logo" on:click={() => scrollToSection('hero')}>QuickFix</h1>

    <!-- Burger Icon -->
    <div class="burger" on:click={() => (menuOpen = !menuOpen)} class:open={menuOpen}>
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- Nav Links -->
    <div class="nav-links" class:open={menuOpen}>
      <a on:click={() => scrollToSection('about')}>About</a>
      <a on:click={() => scrollToSection('how')}>How it Works</a>
      <a href="/login">Login</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/submit">Submit</a>
      <a href="/register">Register</a>
      <a href="/complaints">Complaints</a>
      {#if $user.role === 'admin'}
        <a href="/admin">Admin</a>
      {/if}
    </div>
  </div>
</nav>

<div id="smooth-wrapper" data-scroll-container>
  <slot />
</div>

<style>
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  *, *::before, *::after {
    box-sizing: inherit;
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
    font-weight: bold;
    cursor: pointer;
  }

  .burger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 25px;
    height: 20px;
    cursor: pointer;
    z-index: 1100;
  }

  .burger span {
    height: 3px;
    width: 100%;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .burger.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .burger.open span:nth-child(2) {
    opacity: 0;
  }

  .burger.open span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-links a {
    text-decoration: none;
    color: white;
    font-weight: 500;
    cursor: pointer;
  }

  .nav-links a:hover {
    color: #0af;
  }

  @media (max-width: 768px) {
    .burger {
      display: flex;
    }

    .nav-links {
      flex-direction: column;
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.95);
      padding: 1rem 2rem;
      display: none;
    }

    .nav-links.open {
      display: flex;
      animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>

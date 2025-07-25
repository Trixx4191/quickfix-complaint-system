<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  onMount(() => {
    // Hero Animations
    gsap.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.from(".hero-subtitle", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power2.out",
      delay: 0.8,
    });

    gsap.from(".cta-button", {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 1.2,
    });

    // Scroll-triggered Sections
    gsap.utils.toArray('.section').forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });
  });
</script>

<!-- Hero Section -->
<section id="hero" class="hero section" data-scroll-section>
  <h1 class="hero-title">Welcome to QuickFix</h1>
  <p class="hero-subtitle">Your university complaint system</p>
  <a class="cta-button" href="/login">Submit a Complaint</a>
</section>

<!-- About Section -->
<section id="about" class="section about" data-scroll-section>
  <h2>About QuickFix</h2>
  <p>
    QuickFix is a powerful system to help students voice their concerns, submit complaints, and track resolutions across campus departments — transparently and efficiently.
  </p>
</section>

<!-- How it Works -->
<section id="how" class="section how" data-scroll-section>
  <h2>How It Works</h2>
  <p>
    Login, select your department, describe your issue, and track progress — all from one place.
  </p>
</section>

<style>
  :global(body) {
    margin: 0;
    font-family: sans-serif;
    background: #0e0e0e;
    color: #fff;
  }

  .hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #111;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: bold;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: #ccc;
  }

  .cta-button {
    margin-top: 1rem;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    background-color: #0af;
    color: #fff;
    border-radius: 10px;
    text-decoration: none;
  }

  .section {
    min-height: 100vh;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #1a1a1a;
    text-align: center;
    border-bottom: 1px solid #222;
  }

  .section h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .section p {
    max-width: 600px;
    color: #aaa;
  }

  .about {
    background: #151515;
  }

  .how {
    background: #101010;
  }
</style>

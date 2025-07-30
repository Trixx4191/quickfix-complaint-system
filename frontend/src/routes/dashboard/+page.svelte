<script>
  import { onMount } from 'svelte';

  let complaints = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:5000/complaints');
      const data = await res.json();

      if (res.ok) {
        complaints = data;
      } else {
        error = data.message || 'Failed to fetch complaints.';
      }
    } catch (err) {
      error = 'Server error or backend not reachable.';
    } finally {
      loading = false;
    }
  });
</script>

<section class="dashboard-section">
  <h1 class="heading">Your Complaints</h1>

  {#if loading}
    <p>Loading complaints...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if complaints.length === 0}
    <p>No complaints found.</p>
  {:else}
    {#each complaints as c}
      <div class="complaint-card">
        <h2>{c.title}</h2>
        <p>Status: <span class="status {c.status.toLowerCase()}">{c.status}</span></p>
      </div>
    {/each}
  {/if}
</section>


<style>
  .dashboard-section {
    max-width: 700px;
    margin: 5rem auto;
    padding: 2rem;
    color: white;
    background: #1b1b1b;
    border-radius: 10px;
  }

  .heading {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
  }

  .complaint-card {
    background: #262626;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }

  .complaint-card h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .status {
    font-weight: bold;
  }

  .status.pending {
    color: orange;
  }

  .status.resolved {
    color: lightgreen;
  }
</style>

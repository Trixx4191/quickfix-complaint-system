<script>
  import { onMount } from 'svelte';

  let title = '';
  let description = '';
  let message = '';
  let error = '';

  async function submitComplaint() {
    message = '';
    error = '';

    if (!title || !description) {
      error = 'Please fill in all fields.';
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();

      if (res.ok) {
        message = data.message;
        title = '';
        description = '';
      } else {
        error = data.message || 'Failed to submit complaint.';
      }
    } catch (err) {
      error = 'Failed to connect to the server.';
    }
  }
</script>

<section class="submit-section">
  <h1>Submit a Complaint</h1>

  <form on:submit|preventDefault={submitComplaint}>
    <input
      type="text"
      placeholder="Complaint Title"
      bind:value={title}
      required
    />
    <textarea
      placeholder="Describe your issue"
      bind:value={description}
      required
    ></textarea>
    <button type="submit">Submit</button>
  </form>

  {#if message}
    <p class="success">{message}</p>
  {/if}
  {#if error}
    <p class="error">{error}</p>
  {/if}
</section>

<style>
  .submit-section {
    max-width: 600px;
    margin: 5rem auto;
    padding: 2rem;
    background: #1b1b1b;
    border-radius: 10px;
    color: white;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input, textarea {
    padding: 0.8rem;
    font-size: 1rem;
    background: #333;
    color: white;
    border: none;
    border-radius: 8px;
  }

  button {
    background: #0af;
    color: white;
    padding: 0.8rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  button:hover {
    background: #09c;
  }

  .success {
    color: #0f0;
    margin-top: 1rem;
  }

  .error {
    color: #f55;
    margin-top: 1rem;
  }
</style>

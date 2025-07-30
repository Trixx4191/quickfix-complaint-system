<script>
  import { loginUser } from '$lib/api.js';
  import { goto } from '$app/navigation';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    error = '';
    try {
      const user = await loginUser({ email, password });
      // Save token or session info here if needed
      goto('/dashboard'); // Redirect to a dashboard or home page
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleLogin}>
  <h2>Login to QuickFix</h2>
  {#if error}
    <p style="color: red">{error}</p>
  {/if}
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button disabled={loading}>
    {#if loading} Logging in... {/if}
    {#if !loading} Login {/if}
  </button>
</form>

<style>
  form {
    max-width: 400px;
    margin: 5rem auto;
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: white;
  }

  input {
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
  }

  button {
    padding: 0.75rem;
    background: #0af;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }

  button:disabled {
    background: #555;
  }
</style>

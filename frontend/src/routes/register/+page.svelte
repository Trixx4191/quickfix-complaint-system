<script>
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let role = 'user'; // Default role
  let errorMessage = '';
  let loading = false;

  async function handleRegister() {
    loading = true;
    errorMessage = '';

    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (res.status === 201) {
        goto('/login');
      } else {
        errorMessage = data.message || 'Registration failed';
      }
    } catch (err) {
      errorMessage = 'Server error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<section class="register-section">
  <h2>Register</h2>

  <form on:submit|preventDefault={handleRegister}>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" required />

    <select bind:value={role}>
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>

    <button type="submit" disabled={loading}>
      {#if loading} Registering... {/if}
      {#if !loading} Register {/if}
    </button>
  </form>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
</section>

<style>
  .register-section {
    max-width: 400px;
    margin: 6rem auto;
    padding: 2rem;
    background: #1b1b1b;
    border-radius: 10px;
    color: white;
    text-align: center;
  }

  h2 {
    margin-bottom: 1.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input, select {
    padding: 0.8rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #333;
    color: white;
  }

  button {
    background: #0af;
    color: white;
    padding: 0.8rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  button:hover {
    background: #09c;
  }

  button:disabled {
    background: #444;
    cursor: wait;
  }

  .error {
    margin-top: 1rem;
    color: #f55;
  }
</style>

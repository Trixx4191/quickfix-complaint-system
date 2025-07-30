<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let errorMessage = '';

  async function handleRegister() {
    errorMessage = ''; // Clear existing errors
    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.status === 201) {
        // Registration successful
        goto('/login');
      } else {
        // Handle error message from backend
        errorMessage = data.message || 'Registration failed';
      }
    } catch (err) {
      errorMessage = 'Server error. Please try again.';
    }
  }
</script>

<h2>Register</h2>

<form on:submit|preventDefault={handleRegister}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Register</button>
</form>

{#if errorMessage}
  <p style="color: red">{errorMessage}</p>
{/if}

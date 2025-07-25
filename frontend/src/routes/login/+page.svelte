<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  async function login() {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.status === 200) {
      goto('/dashboard');
    } else {
      error = data.message;
    }
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center space-y-4">
  <h2 class="text-2xl font-semibold">Login</h2>
  <input type="email" placeholder="Email" bind:value={email} class="p-2 border rounded" />
  <input type="password" placeholder="Password" bind:value={password} class="p-2 border rounded" />
  <button on:click={login} class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}
</div>

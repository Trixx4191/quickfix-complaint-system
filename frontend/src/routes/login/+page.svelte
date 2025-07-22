<script>
  let email = '';
  let password = '';
  let message = '';

  async function login() {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    message = data.message;

    if (res.ok) {
      window.location.href = '/dashboard';
    }
  }
</script>

<h1 class="text-3xl font-bold mb-4">Login</h1>
<input bind:value={email} type="email" placeholder="Email" class="border p-2 mb-2 block w-full" />
<input bind:value={password} type="password" placeholder="Password" class="border p-2 mb-2 block w-full" />
<button on:click={login} class="bg-green-600 text-white px-4 py-2">Login</button>
<p class="mt-2 text-sm text-gray-700">{message}</p>

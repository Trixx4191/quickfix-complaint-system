<script>
  let title = '';
  let description = '';
  let message = '';

  async function submitComplaint() {
    const res = await fetch('http://localhost:5000/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    const data = await res.json();
    message = data.message;

    if (res.ok) {
      // Optionally clear form
      title = '';
      description = '';
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">Submit a Complaint</h1>

<input
  type="text"
  bind:value={title}
  placeholder="Complaint Title"
  class="border p-2 block w-full mb-2"
/>
<textarea
  bind:value={description}
  placeholder="Describe your complaint"
  class="border p-2 block w-full mb-2"
></textarea>
<button on:click={submitComplaint} class="bg-blue-600 text-white px-4 py-2 rounded">
  Submit
</button>

{#if message}
  <p class="mt-4 text-green-600 font-semibold">{message}</p>
{/if}

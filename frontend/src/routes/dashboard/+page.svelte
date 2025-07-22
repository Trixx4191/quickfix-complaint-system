<script>
  let complaints = [
    { id: 1, title: 'Road not fixed', status: 'Pending' },
    { id: 2, title: 'No water in hostel', status: 'Resolved' }
  ];
</script>

<h1 class="text-3xl font-bold mb-6">Your Complaints</h1>

{#each complaints as c}
  <div class="mb-4 p-4 border rounded shadow">
    <h2 class="text-xl font-semibold">{c.title}</h2>
    <p>Status: <span class="font-bold">{c.status}</span></p>
  </div>
{/each}

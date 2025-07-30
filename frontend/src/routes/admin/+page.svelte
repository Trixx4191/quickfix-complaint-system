<script>
  import { onMount } from 'svelte';
  let complaints = [];
  let error = '';
  let loading = true;

  async function fetchComplaints() {
    loading = true;
    try {
      const res = await fetch('http://localhost:5000/complaints');
      const data = await res.json();
      if (res.ok) {
        complaints = data;
      } else {
        error = data.message || 'Failed to fetch complaints.';
      }
    } catch (err) {
      error = 'Server error.';
    } finally {
      loading = false;
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}`, {
        method: 'PATCH', // ✅ Use PATCH here
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchComplaints(); // ✅ Refresh list after update
      } else {
        alert(data.message || 'Failed to update');
      }
    } catch (err) {
      alert('Server error updating status.');
    }
  }

  onMount(fetchComplaints);
</script>

<section class="admin-section">
  <h1>Admin Complaint Panel</h1>

  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    {#each complaints as c}
      <div class="card">
        <h2>{c.title}</h2>
        <p><strong>Description:</strong> {c.description}</p>
        <p><strong>Submitted by:</strong> {c.user_email}</p> <!-- ✅ Display user email -->
        <p><strong>Complaint ID:</strong> {c.id}</p>
        <p><strong>Created At:</strong> {new Date(c.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(c.updated_at).toLocaleString()}</p>
        <p><strong>Resolved At:</strong> {c.resolved_at ? new Date(c.resolved_at).toLocaleString() : 'Not resolved yet'}</p>
        <p><strong>Resolved By:</strong> {c.resolved_by || 'N/A'}</p>
        <p><strong>Resolved Description:</strong> {c.resolved_description || 'N/A'}</p>
        <p><strong>Status:</strong> {c.status}</p>

        <select on:change={(e) => updateStatus(c.id, e.target.value)}>
          <option value="Pending" selected={c.status === 'Pending'}>Pending</option>
          <option value="Resolved" selected={c.status === 'Resolved'}>Resolved</option>
        </select>
      </div>

    {/each}
  {/if}
</section>

<style>
  .admin-section {
    max-width: 800px;
    margin: 5rem auto;
    padding: 2rem;
    background: #1b1b1b;
    color: white;
    border-radius: 10px;
  }

  .card {
    background: #2a2a2a;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-radius: 8px;
  }

  select {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    border: none;
    font-size: 1rem;
  }

  .error {
    color: red;
  }
</style>

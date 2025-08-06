<script>
  import { onMount } from 'svelte';

  let complaints = [];
  let error = '';
  let loading = true;
  let success = '';

  async function fetchComplaints() {
    loading = true;
    error = '';
    success = '';
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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
    const token = localStorage.getItem('token');
    const resolved_by = localStorage.getItem('userEmail') || 'admin@quickfix';

    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          resolved_by,
          resolved_description: `Auto-marked as ${newStatus}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        success = `Complaint #${id} marked as ${newStatus}`;
        await fetchComplaints(); // Refresh list
      } else {
        error = data.message || 'Failed to update';
      }
    } catch (err) {
      error = 'Server error updating status.';
    }
  }

  onMount(fetchComplaints);
</script>

<section class="admin-section">
  <h1>Admin Complaint Panel</h1>

  {#if loading}
    <p>Loading complaints...</p>
  {:else}
    {#if error}
      <p class="error">{error}</p>
    {/if}

    {#if success}
      <p class="success">{success}</p>
    {/if}

    {#each complaints as c (c.id)}
      <div class="card">
        <h2>{c.title}</h2>
        <p><strong>Description:</strong> {c.description}</p>
        <p><strong>Submitted by:</strong> {c.user_email}</p>
        <p><strong>ID:</strong> {c.id}</p>
        <p><strong>Created:</strong> {c.created_at ? new Date(c.created_at).toLocaleString() : 'N/A'}</p>
        <p><strong>Updated:</strong> {c.updated_at ? new Date(c.updated_at).toLocaleString() : 'N/A'}</p>
        <p><strong>Resolved At:</strong> {c.resolved_at ? new Date(c.resolved_at).toLocaleString() : 'Not resolved'}</p>
        <p><strong>Resolved By:</strong> {c.resolved_by || 'N/A'}</p>
        <p><strong>Resolution:</strong> {c.resolved_description || 'N/A'}</p>
        <p><strong>Status:</strong> {c.status}</p>

        <select
          bind:value={c.status}
          on:change={(e) => updateStatus(c.id, e.target.value)}
          disabled={c.status === 'Resolved'}
        >
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
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
    margin-bottom: 1.5rem;
    border-radius: 8px;
    border-left: 5px solid #0af;
  }

  select {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    border: none;
    font-size: 1rem;
    background: #111;
    color: white;
  }

  .error {
    color: red;
    margin-bottom: 1rem;
  }

  .success {
    color: #0f0;
    margin-bottom: 1rem;
  }
</style>

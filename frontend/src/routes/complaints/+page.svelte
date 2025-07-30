<script>
  export let data;
  let complaints = data.complaints;
</script>

<section class="complaints-list">
  <h1>Submitted Complaints</h1>

  {#if complaints.length === 0}
    <p>No complaints submitted yet.</p>
  {:else}
    <ul>
      {#each complaints as complaint}
        <li class="complaint-item">
          <h3>{complaint.title}</h3>
          <p>{complaint.description}</p>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .complaints-list {
    max-width: 700px;
    margin: 4rem auto;
    padding: 2rem;
    background: #1b1b1b;
    border-radius: 10px;
    color: white;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li.complaint-item {
    background: #262626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem;
  }
</style>

<script>
  import Prefix from './pipeline/prefix.svelte'
  import Suffix from './pipeline/suffix.svelte'

  export let prefs;
  export let deleteMode;
  export let toggleOpts;
  export let toggleDeleteMode;
  export let resetOptions;
  export let deleteButtonDisabled;
  export let deleteSelectedEmoji;

  let availablePipelines = [
    {id: 1, ctr: Prefix},
    {id: 2, ctr: Suffix},
  ]

  export let pipeline = [];

  let selectedPipeline = 1;

  function addPipeline() {
    console.log('🥳')
    pipeline[pipeline.length] = availablePipelines.filter(p => p.id == selectedPipeline)[0].ctr
  }
</script>

<style>
  .customizations {
    display: flex;
  }

  .toggle-opts {
    margin-bottom: 1rem;
  }

  .delete-mode {
    margin-bottom: 1rem;
    float: right;
  }
</style>

<div>
  <button
    class="c-button c-button--outline c-button--medium toggle-opts"
    style="visibility: {deleteMode ? 'hidden' : 'visible'}"
    type="button"
    name="options"
    on:click={toggleOpts}>
    ⚙️ { prefs.showOptions ? 'Hide' : 'Show'} options
  </button>
  <button
    class="c-button c-button--outline c-button--medium toggle-opts"
    style="visibility: {deleteMode ? 'hidden' : 'visible'}"
    type="button"
    name="reset-options"
    on:click={resetOptions}>
    🔄 Reset options
  </button>
  <span class="delete-mode">
    <button
      class="c-button c-button--outline c-button--medium {deleteButtonDisabled ? 'c-button--disabled' : ''}"
      type="button"
      style="display: {deleteMode ? 'inline' : 'none'}"
      name="deleteSelected"
      on:click={deleteSelectedEmoji}>
      {deleteButtonDisabled ? 'Select some emoji to delete' : '🔥 Delete selected emoji'}
    </button>
    <button
      class="c-button c-button--outline c-button--medium"
      type="button"
      name="deleteMode"
      on:click={toggleDeleteMode}>
      💣 {deleteMode ? 'Disable' : 'Enable'} bulk delete mode
    </button>
  </span>
  <p
    class="customizations"
    style="display:{prefs.showOptions && !deleteMode ? 'flex' : 'none'}">
    <label class="checkbox normal">
      <input type="checkbox" bind:checked={prefs.allowOverwrite} />
      Allow overwriting existing emoji (does not apply to standard emoji)
    </label>
  </p>
  <p
    class="customizations"
    style="display:{prefs.showOptions && !deleteMode ? 'flex' : 'none'}">

    <select bind:value={selectedPipeline}>
      {#each availablePipelines as name}
        <option value={name.id}>
          {name.ctr.name}
        </option>
      {/each}
    </select>

    <button
      class="c-button c-button--outline c-button--medium"
      type="button"
      name="add-pipeline"
      on:click={addPipeline}
    >Add transformation</button>
  </p>

  {#each pipeline as pipe}
    <svelte:component this={pipe} bind:prefs={prefs} {deleteMode}/>
  {/each}

  <p>
  </p>
</div>

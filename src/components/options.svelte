<script>
  export let prefs;
  export let deleteMode;
  export let toggleOpts;
  export let toggleDeleteMode;
  export let resetOptions;
  export let deleteButtonDisabled;
  export let deleteSelectedEmoji;
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
    <input
      bind:value={prefs.prefix}
      type="text"
      name="prefix"
      placeholder="optional prefix" />
    &nbsp;
    <input
      bind:value={prefs.suffix}
      type="text"
      name="suffix"
      placeholder="optional suffix" />
  </p>
</div>

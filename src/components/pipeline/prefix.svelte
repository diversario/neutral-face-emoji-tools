<script>
  export let prefs;
  export let deleteMode;
</script>

<style>
  .customizations {
    display: flex;
  }
</style>

<div>
  <p
    class="customizations"
    style="display:{prefs.showOptions && !deleteMode ? 'flex' : 'none'}">
    <input
      bind:value={prefs.prefix}
      type="text"
      name="prefix"
      placeholder="optional prefix" />
  </p>
</div>

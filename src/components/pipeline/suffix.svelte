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
      bind:value={prefs.suffix}
      type="text"
      name="suffix"
      placeholder="optional suffix" />
  </p>
</div>

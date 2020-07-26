<script>
  export let removal;
  export let status;
</script>

<style>
  .removal {
    display: flex;
    align-items: center;
    padding: 2px 0 1px 0;
    border-bottom: 1px solid var(--color-slack-border);
  }

  .removal:last-child {
    border-bottom: none;
  }

  .preview {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5em;
  }

  .filename {
    font-weight: bold;
    margin-right: 1em;
  }

  .ext {
    font-weight: bold;
    margin-right: 1em;
    color: rgba(0, 0, 0, 0.2)
  }

  .status {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-slack-info);
    font-family: Consolas, monospace;
  }

  .status .icon {
    display: none;
    margin-right: 0.25em;
  }

  .status .icon:before {
    display: block;
  }

  .removal.removing .status .icon.removing {
    display: block;
  }

  .removal.error .status .icon.error {
    display: block;
  }

  .removal.success .status .icon.success {
    display: block;
  }

  .removal.removing .status {
    color: var(--color-slack-info);
  }

  .removal.error .status {
    color: var(--color-slack-error);
  }

  .removal.success .status {
    color: var(--color-slack-success);
  }
</style>

<li
  class="removal"
  class:removing={status.type === 'removing'}
  class:error={status.type === 'error'}
  class:success={status.type === 'success'}>
  <img class="preview" src={removal.img.src} alt="" />
  <span class="filename">{removal.name}</span>
  <span class="status">
    <i class="icon removal ts_icon ts_icon_spinner"></i>
    <i class="icon error ts_icon ts_icon_warning"></i>
    <i class="icon success ts_icon ts_icon_check_circle_o"></i>
    <span class="text">{status.message}</span>
  </span>
</li>

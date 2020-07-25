<script>
  import Upload from './upload.svelte';
  import FileDropzone from './file-dropzone.svelte';

  import uploadEmoji from '../upload-emoji.js';

  const SET_ICON_URL = safari.extension.baseURI + 'icon_128_128.png';

  let uploads = [];
  let uploadsStatusById = {};

  let prefix = ''
  let suffix = ''

  let searchStr = ''
  let replaceStr = ''

  let showOpts = false

  function toggleOpts() {
    showOpts = !showOpts
  }

  function uploadFiles (files, idx) {
    const uploadFns = files.map(file => {
      const obj = uploadEmoji(file, {prefix, suffix})

      uploadsStatusById = {
        ...uploadsStatusById,
        [obj.id]: {
          type: 'uploading',
          message: 'Uploading...'
        }
      };

      uploads = [...uploads, {
        file,
        id: obj.id
      }];

      return obj.upload
    });

    processUploads(uploadFns.reverse())
  }

  function processUploads(uploads) {
    if (!uploads || uploads.length == 0) return

    const nextUpload = uploads.pop()
    // const nextTick = Date.now() + 1000

    nextUpload((id, error) => {
        if (error) {
          uploadsStatusById = {
            ...uploadsStatusById,
            [id]: {
              type: 'error',
              message: error.message || error
            }
          };
        } else {
          uploadsStatusById = {
            ...uploadsStatusById,
            [id]: {
              type: 'success',
              message: 'Successfully Uploaded.'
            }
          };
        }

        // let sleepFor = nextTick - Date.now()
        // if (sleepFor < 0) sleepFor = 0

        // setTimeout(() => processUploads(uploads), sleepFor)
        processUploads(uploads)
      });
  }

  function handleFilesAdded (event) {
    const files = event.detail;

    uploadFiles(files);
  }
</script>

<style>
  .neutral-face-emoji-tools {
    border: var(--color-slack-border) 1px solid;
    border-left: var(--color-neutral-face-emoji-tools) 3px solid;
    margin: 0 0 25px 0;
    padding: 25px;
    background: white;
  }

  .icon.heading {
    margin: 0 5px 0 0;
    height: 1.25em;
    vertical-align: -25%;
  }

  .input-note {
    font-size: .9rem;
    line-height: 1.25rem;
    color: var(--color-text-gray);
  }

  .uploads {
    list-style-type: none;
    margin: 0;
    font-size: 0.9rem;
  }

  .customizations {
    display: flex
  }

  .toggle-opts {
    margin-bottom: 1rem;
  }

  .neutral-face-emoji-tools .mono{
    font-family: 'Courier New', Courier, monospace
  }
</style>

<div class="neutral-face-emoji-tools">
  <h4 class="heading">
    <img class="icon heading" src="{SET_ICON_URL}" alt="" />
    <span class="text">Bulk Emoji Uploader</span>
  </h4>
  <p class="subheading">Drag and drop images into the area below. Images will be uploaded using their filename as the emoji name.</p>
  <p class="input-note">Example: <span class="normal">"meow-party.gif" will be added as <span class="mono"><strong>:{prefix}meow-party{suffix}:</strong></span></span></p>
  <button class="c-button c-button--outline c-button--medium toggle-opts" type="button" name="options" on:click={toggleOpts}>⚙️ { showOpts ? "Hide" : "Show"} options</button>
  <p class="customizations" style="display:{showOpts ? "flex" : "none"}">
    <input bind:value={prefix} type="text" name="prefix" placeholder="optional prefix">
    &nbsp;
    <input bind:value={suffix} type="text" name="suffix" placeholder="optional suffix">
  </p>
  <!-- <p class="customizations" style="display:{showOpts ? "flex" : "none"}">
    <input bind:value={searchStr} type="text" name="searchStr" placeholder="replace these characters...">
    &nbsp;
    <input bind:value={replaceStr} type="text" name="replaceStr" placeholder="...with these">
  </p> -->
  <FileDropzone on:filesadded={handleFilesAdded} />
  <ul class="uploads">
    {#each uploads as upload (upload.id)}
      <Upload upload={upload} status={uploadsStatusById[upload.id]} prefix={prefix} suffix={suffix} searchStr={searchStr} replaceStr={replaceStr} />
    {/each}
  </ul>
</div>

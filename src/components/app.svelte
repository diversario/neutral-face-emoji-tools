<script>
  import Upload from "./upload.svelte";
  import Removal from "./removal.svelte";
  import FileDropzone from "./file-dropzone.svelte";

  import uploadEmoji from "../upload-emoji.js";
  import removeEmoji from "../remove-emoji.js";

  const SET_ICON_URL = safari.extension.baseURI + "icon_128_128.png";
  const EMOJI_LIST_SELECTOR = "div.p-customize_emoji_list__row";

  function getOptionOrDefault(name, defaultValue) {
    let retval = localStorage.getItem(name)
    if ( retval != null ) return JSON.parse(localStorage.getItem(name));
    return defaultValue;
  }

  const DEFAULT_OPTIONS = {
    showOptions: false,
    allowOverwrite: false,
    prefix: "",
    suffix: "",
  }

  let _prefs = {
    showOptions: getOptionOrDefault("showOptions", DEFAULT_OPTIONS.showOptions),
    allowOverwrite: getOptionOrDefault("allowOverwrite", DEFAULT_OPTIONS.allowOverwrite),
    prefix: getOptionOrDefault("prefix", DEFAULT_OPTIONS.prefix),
    suffix: getOptionOrDefault("suffix", DEFAULT_OPTIONS.suffix),
  };

  let prefs = new Proxy(_prefs, {
    set: function(target, key, value) {
      target[key] = value;
      localStorage.setItem(key, JSON.stringify(value));
      return true
    }
  });

  let uploads = [];
  let uploadsStatusById = {};

  let searchStr = "";
  let replaceStr = "";

  let deleteMode = false;
  let deleteButtonDisabled = true;

  let emojiToDelete = {};
  let removals = [];
  let removalStatusByName = {};

  function toggleOpts() {
    prefs.showOptions = !prefs.showOptions
  }

  function resetOptions() {
    Object.keys(DEFAULT_OPTIONS).forEach(k => {
      prefs[k] = DEFAULT_OPTIONS[k]
    })
  }

  function toggleDeleteMode() {
    deleteMode = !deleteMode;

    if (!deleteMode) {
      Object.keys(emojiToDelete).forEach(k => {
        emojiToDelete[k].removeAttribute("toDelete");
        emojiToDelete[k].classList.remove("c-alert--level_error");
      });
      emojiToDelete = {};
    }
  }

  function uploadFiles(files, idx) {
    const uploadFns = files.map(file => {
      const obj = uploadEmoji(file, { prefix: prefs.prefix, suffix: prefs.suffix, allowOverwrite: prefs.allowOverwrite });

      uploadsStatusById = {
        ...uploadsStatusById,
        [obj.id]: {
          type: "uploading",
          message: "Uploading..."
        }
      };

      uploads = [
        ...uploads,
        {
          file,
          id: obj.id
        }
      ];

      return obj.upload;
    });

    processUploads(uploadFns.reverse());
  }

  function processUploads(uploads) {
    if (!uploads || uploads.length == 0) return;

    const nextUpload = uploads.pop();

    nextUpload((id, error) => {
      if (error) {
        uploadsStatusById = {
          ...uploadsStatusById,
          [id]: {
            type: "error",
            message: error.message || error
          }
        };
      } else {
        uploadsStatusById = {
          ...uploadsStatusById,
          [id]: {
            type: "success",
            message: "Successfully Uploaded."
          }
        };
      }

      processUploads(uploads);
    });
  }

  function handleFilesAdded(event) {
    const files = event.detail;

    uploadFiles(files);
  }

  function deleteSelectedEmoji() {
    Object.keys(emojiToDelete).forEach(emoji => {
      let img = emojiToDelete[emoji].childNodes[0].getElementsByTagName(
        "img"
      )[0];
      removals.push({ name: emoji, img });
      removalStatusByName[emoji] = {
        type: "removing",
        message: "Deleting..."
      };
    });

    function remove(nameList) {
      if (!nameList || nameList.length == 0) return;

      let name = nameList.pop();
      let apiName = name.slice(1, name.length - 1);

      removeEmoji(apiName, err => {
        if (err) {
          removalStatusByName[name].type = "error";
          removalStatusByName[name].message = err.message;
        } else {
          removalStatusByName[name].type = "success";
          removalStatusByName[name].message = "Deleted";
        }

        remove(nameList);
      });
    }

    remove(Object.keys(emojiToDelete).reverse());
  }

  const EMOJI_LIST_CONTAINER = ".p-customize_emoji_list__container";
  elementsAreReady(EMOJI_LIST_CONTAINER).then(els => {
    const targetNode = els[0];

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(e => {
            restoreDeleteState(e);
            e.addEventListener("click", () => onRowClick(e));
          });
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  });

  function restoreDeleteState(e) {
    let name = e.innerText.trim().split(/\s+/)[0];

    if (emojiToDelete[name]) {
      emojiToDelete[name] = e;

      e.setAttribute("toDelete", "true");
      e.classList.add("c-alert--level_error");
    }
  }

  function onRowClick(e) {
    if (!deleteMode) return;

    let name = e.innerText.trim().split(/\s+/)[0];

    if (e.getAttribute("toDelete")) {
      delete emojiToDelete[name];

      e.removeAttribute("toDelete");
      e.classList.remove("c-alert--level_error");
    } else {
      emojiToDelete[name] = e;

      e.setAttribute("toDelete", "true");
      e.classList.add("c-alert--level_error");
    }

    deleteButtonDisabled = Object.keys(emojiToDelete).length == 0;
  }

  function elementsAreReady(selector) {
    return new Promise(resolve => {
      function checkForElement() {
        const elements = document.querySelectorAll(selector);

        if (elements && elements.length > 0) {
          resolve(elements);
        } else {
          setTimeout(checkForElement, 1000);
        }
      }

      checkForElement();
    });
  }

  elementsAreReady(EMOJI_LIST_SELECTOR).then(els => {
    els.forEach(e => e.addEventListener("click", () => onRowClick(e)));
  });
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
    font-size: 0.9rem;
    line-height: 1.25rem;
    color: var(--color-text-gray);
  }

  .uploads {
    list-style-type: none;
    margin: 0;
    font-size: 0.9rem;
  }

  .removals {
    list-style-type: none;
    margin: 0;
    font-size: 0.9rem;
  }

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

  .neutral-face-emoji-tools .mono {
    font-family: "Courier New", Courier, monospace;
  }
</style>

<div class="neutral-face-emoji-tools">
  <h4 class="heading">
    <img class="icon heading" src={SET_ICON_URL} alt="" />
    <span class="text">Bulk Emoji Uploader</span>
  </h4>
  <p class="subheading">
    Drag and drop images into the area below. Images will be uploaded using
    their filename as the emoji name.
  </p>
  <p class="input-note">
    Example:
    <span class="normal">
      "meow-party.gif" will be added as
      <span class="mono">
        <strong>:{prefs.prefix}meow-party{prefs.suffix}:</strong>
      </span>
    </span>
  </p>
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

  <FileDropzone on:filesadded={handleFilesAdded} visible={!deleteMode} />

  <ul class="uploads">
    {#each uploads as upload (upload.id)}
      <Upload
        {upload}
        status={uploadsStatusById[upload.id]}
        prefix={prefs.prefix}
        suffix={prefs.suffix}
        {searchStr}
        {replaceStr} />
    {/each}
  </ul>

  <ul class="removals" style="display:{deleteMode ? 'block' : 'none'}">
    {#each removals as removal (removal.name)}
      <Removal {removal} status={removalStatusByName[removal.name]} />
    {/each}
  </ul>
</div>

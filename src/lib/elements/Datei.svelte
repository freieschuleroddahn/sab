<script>
    import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';

    const pb = new PocketBase('https://sab-roddahn.kruw.de/');

    export let document;

    let loading = false;
    let previewFile = null;

    async function updateDone(userID, dateiID, userDatei) {
      loading = true;
      const data = {
          "user": userID,
          "datei": dateiID,
          "done": true
      };

      if(userDatei == undefined) {
        // create data
        const record = await pb.collection('user_datei').create(data);
        document.expand = {
          "user_datei(datei)": [
            record
          ]
        }
      } else {
        // update data
        data.done = !userDatei["user_datei(datei)"][0].done
        const userDateiID = userDatei["user_datei(datei)"][0].id;
        const record = await pb.collection('user_datei').update(userDateiID, data);
        document.expand["user_datei(datei)"][0] = record;
      }

      loading = false;
    }

    async function updateSeen(userID, dateiID, userDatei, change = true) {
      loading = true;
      const data = {
          "user": userID,
          "datei": dateiID,
          "seen": true
      };

      if(userDatei == undefined) {
        // create data
        const record = await pb.collection('user_datei').create(data);
        document.expand = {
          "user_datei(datei)": [
            record
          ]
        }
      } else {
        // update data
        if(change) {
          data.seen = !userDatei["user_datei(datei)"][0].seen
        }
        const userDateiID = userDatei["user_datei(datei)"][0].id;
        const record = await pb.collection('user_datei').update(userDateiID, data);
        document.expand["user_datei(datei)"][0] = record;
      }

      loading = false;
    }

    function viewFile() {
      const fileUrl = `https://sab-roddahn.kruw.de/api/files/${document.collectionName}/${document.id}/${document.file}`;
      
      if (document.file.toLowerCase().includes('.pdf')) {
        // Open PDF in new tab
        window.open(fileUrl, '_blank');
      } else if (isImageFile(document.file)) {
        // Show image in modal
        previewFile = {
          filename: document.name,
          url: fileUrl
        };
      } else {
        // For other files, just download
        window.open(fileUrl, '_blank');
      }
    }

    function isImageFile(filename) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
      const extension = filename.toLowerCase().split('.').pop();
      return imageExtensions.includes(extension);
    }

    function closePreview() {
      previewFile = null;
    }

    function handleKeydown(event) {
      if (event.key === 'Escape' && previewFile) {
        closePreview();
      }
    }

    function getFileIcon(filename) {
      const extension = filename.toLowerCase().split('.').pop();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
        return '🖼️';
      } else if (extension === 'pdf') {
        return '📄';
      } else if (['doc', 'docx'].includes(extension)) {
        return '📝';
      } else if (['xls', 'xlsx'].includes(extension)) {
        return '📊';
      } else if (['ppt', 'pptx'].includes(extension)) {
        return '📈';
      } else if (['zip', 'rar', '7z'].includes(extension)) {
        return '📦';
      } else {
        return '📄';
      }
    }
</script>

<div class="file-card">
  {#if isImageFile(document.file)}
    <img
      src="{`https://sab-roddahn.kruw.de/api/files/${document.collectionName}/${document.id}/${document.file}`}?thumb=300x300"
      alt={document.name}
      class="file-preview"
    />
  {:else}
    <div class="file-icon-preview">
      {getFileIcon(document.file)}
    </div>
  {/if}
  
  <div class="file-name">{document.name}</div>
  
  {#if document.beschreibung}
    <div class="file-description">{document.beschreibung}</div>
  {/if}
  
  <div class="file-actions">
    <button 
      class="view-btn"
      on:click={viewFile}
      title="Datei anzeigen"
    >
      👁️ Ansehen
    </button>
    <a 
      href="{`https://sab-roddahn.kruw.de/api/files/${document.collectionName}/${document.id}/${document.file}`}" 
      download 
      class="download-btn"
      on:click={() => updateSeen($user.id, document.id, document.expand, false)}
    >
      ⬇️ Download
    </a>
  </div>
  
  <!-- Status indicators -->
  <div class="status-indicators">
    <button 
      class="status-btn seen-btn" 
      class:active={(document?.expand && document?.expand?.["user_datei(datei)"]?.[0].seen)}
      class:loading={loading}
      on:click={() => updateSeen($user.id, document.id, document.expand)}
      title="Als gesehen markieren"
    >
      👁️
    </button>
    <button 
      class="status-btn done-btn" 
      class:active={(document?.expand && document?.expand?.["user_datei(datei)"]?.[0].done)}
      class:loading={loading}
      on:click={() => updateDone($user.id, document.id, document.expand)}
      title="Als erledigt markieren"
    >
      ✓
    </button>
  </div>
</div>

<!-- Image Preview Modal -->
{#if previewFile}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="preview-modal" on:click={closePreview}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="preview-content" on:click|stopPropagation>
      <button class="close-btn" on:click={closePreview}>✕</button>
      <div class="preview-header">
        <h3>{previewFile.filename}</h3>
      </div>
      <div class="preview-body">
        <img 
          src={previewFile.url} 
          alt={previewFile.filename}
          class="preview-image"
        />
      </div>
      <div class="preview-actions">
        <a 
          href={previewFile.url} 
          download 
          class="modal-download-btn"
        >
          ⬇️ Download
        </a>
      </div>
    </div>
  </div>
{/if}

<!-- Global keyboard handler -->
<svelte:window on:keydown={handleKeydown} />

<style>
  .file-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    background: var(--surface);
  }

  .file-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow);
  }

  .file-preview {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-bottom: 1px solid var(--border);
  }

  .file-icon-preview {
    height: 120px;
    background: var(--surface-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    border-bottom: 1px solid var(--border);
    color: var(--text-muted);
  }

  .file-name {
    padding: 0.75rem;
    font-size: 0.9em;
    text-align: center;
    word-break: break-word;
    font-weight: 600;
    color: var(--text);
  }

  .file-description {
    padding: 0 0.75rem;
    font-size: 0.8em;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  .file-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--surface-muted);
  }

  .view-btn,
  .download-btn {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }

  .view-btn {
    background: #17a2b8;
    color: white;
  }

  .view-btn:hover {
    background: #138496;
  }

  .download-btn {
    background: #28a745;
    color: white;
  }

  .download-btn:hover {
    background: #218838;
  }

  .status-indicators {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.25rem;
  }

  .status-btn {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--border);
    border-radius: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.7rem;
    color: var(--text);
  }

  .status-btn:hover {
    background: var(--surface);
    transform: scale(1.1);
  }

  .status-btn.loading {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .seen-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .done-btn.active {
    background: #28a745;
    color: white;
    border-color: #28a745;
  }

  .preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .preview-content {
    background: var(--surface);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    flex-direction: column;
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 1001;
    font-size: 1.2rem;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 1);
  }

  .preview-header {
    padding: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .preview-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text);
  }

  .preview-body {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 70vh;
  }

  .preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .preview-actions {
    padding: 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: center;
  }

  .modal-download-btn {
    background: #28a745;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .modal-download-btn:hover {
    background: #218838;
    text-decoration: none;
    color: white;
  }
</style>
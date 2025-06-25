<script>
  import PocketBase from 'pocketbase';
  import { user } from '$lib/stores/user.js';
  import Datei from '$lib/elements/Datei.svelte';
  import RangeSlider from 'svelte-range-slider-pips';

  const pb = new PocketBase('https://sab-roddahn.kruw.de/');
  
  export let data;

  let opened = false;
  let loading = false;
  let note = '';
  let wert = [0];
  let userKompetenzRecord = null;
  let debounceTimer;
  let fileInput;
  let ukFiles = [];

  // Status calculation
  const getStatus = (value) => {
    if (value <= 0) return 'none';
    if (value <= 100) return 'red';
    if (value >= 900) return 'green';
    return 'orange';
  };

  // Initialize from PocketBase data
  $: {
    try {
      ukFiles = data?.expand?.['user_kompetenz_dateien(kompetenz)'] || [];
      const ukArray = data?.expand?.['user_kompetenz(kompetenz)'] || [];
      const uk = ukArray.find(uk => uk?.user === $user?.id);
      userKompetenzRecord = uk || null;
      wert = [uk?.wert || 0];
      note = uk?.note || '';
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async function saveProgress() {
    if (!pb.authStore.isValid || !$user?.id) return;
    
    loading = true;
    const saveData = {
      user: $user.id,
      kompetenz: data?.id,
      wert: wert[0],
      note: note
    };

    try {
      if (userKompetenzRecord?.id) {
        userKompetenzRecord = await pb.collection('user_kompetenz').update(
          userKompetenzRecord.id, 
          saveData,
          { expand: 'files' }
        );
      } else {
        userKompetenzRecord = await pb.collection('user_kompetenz').create(saveData);
        // data.expand = { ...data.expand, 'user_kompetenz(kompetenz)': [userKompetenzRecord] };
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      loading = false;
    }
  }

  function setWert(value) {
    wert = [value];
    saveProgress();
  }

  function handleSlider(e) {
    wert = [e.detail.values[0]];
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(saveProgress, 300);
  }

  function handleNote(e) {
    note = e.target.value; // This line becomes redundant with bind:value
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(saveProgress, 800);
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file || !pb.authStore.isValid || !$user?.id || !data?.id) return;

    const formData = new FormData();
    formData.append('user', $user.id);
    formData.append('kompetenz', data.id);
    formData.append('filename', file.name);
    formData.append('datei', file);

    try {
      const record = await pb.collection('user_kompetenz_dateien').create(formData);
      
      // Update local data to reflect new file
      data.expand = { 
        ...data.expand, 
        'user_kompetenz_dateien(kompetenz)': [
          ...(data.expand?.['user_kompetenz_dateien(kompetenz)'] || []), 
          record
        ]
      };
      
      // Update ukFiles directly to show immediately
      ukFiles = [...ukFiles, record];
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      fileInput.value = ''; // Reset input
    }
  }
</script>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<div class="competency-card">
  <div class="header" on:click={() => opened = !opened}>
    <h3>{data?.name || 'Unnamed Competency'}</h3>
    <div class="status-buttons">
      <button 
        on:click|preventDefault|stopPropagation={() => setWert(50)} 
        class:active={getStatus(wert[0]) === 'red'}
        class="status-btn red"
      >
        Kenne
      </button>
      <button 
        on:click|preventDefault|stopPropagation={() => setWert(500)} 
        class:active={getStatus(wert[0]) === 'orange'}
        class="status-btn orange"
      >
        Übe
      </button>
      <button 
        on:click|preventDefault|stopPropagation={() => setWert(1000)} 
        class:active={getStatus(wert[0]) === 'green'}
        class="status-btn green"
      >
        Kann
      </button>
    </div>
  </div>

  <div class="slider-container">
    <RangeSlider
      min={0}
      max={1000}
      values={wert}
      on:change={handleSlider}
      disabled={loading}
      pips={{ mode: 'values', values: [0, 100, 500, 900, 1000], density: 4 }}
    />
    {#if loading}
      <div class="loader"></div>
    {/if}
  </div>

  {#if opened}
    <div class="content">
      <div class="note-section">
        <label for="note-textarea">Notizen:</label>
        <textarea
          id="note-textarea"
          value={note}
          on:input={handleNote}
          placeholder="Notizen hier eingeben..."
          class="fancy-textarea"
        />
      </div>

      <div class="files-section">
        <h4>Eigene Dateien:</h4>

        {#if ukFiles.length}
          <div class="file-grid">
            {#each ukFiles as file}
              <div class="file-card">
                {#if file.datei.includes('.pdf')}
                  <div class="pdf-preview">📄 PDF</div>
                {:else}
                  <img
                    src="{pb.getFileUrl(file, file.datei)}?thumb=300x300"
                    alt="Upload"
                    class="file-preview"
                  />
                {/if}
                <div class="file-name">{file.filename}</div>
                <a href="{pb.getFileUrl(file, file.datei)}" 
                   download 
                   class="download-overlay">
                  ⬇️ Download
                </a>
              </div>
            {/each}
          </div>
        {:else}
          <p class="no-files">Noch keine Dateien hochgeladen</p>
        {/if}

        <label class="upload-button">
          <input
            type="file"
            bind:this={fileInput}
            accept="image/*, .pdf"
            on:change={handleFileUpload}
          />
          <span class="upload-label">📁 Datei hochladen</span>
        </label>
      </div>

      {#if data?.expand?.["dateien(kompetenz)"]?.length}
        <div class="material-section">
          <h4>Materialien:</h4>
          <div class="material-grid">
            {#each data.expand["dateien(kompetenz)"] as document}
              {#if document?.id}
                <Datei {document} />
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :root {
    --red: #ff4444;
    --orange: #ff9900;
    --green: #00c851;
    --blue: #2196F3;
    --shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .competency-card {
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin: 1rem 0;
    overflow: hidden;
  }

  .header {
    padding: 1.5rem;
    background: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
  }

  .header:hover {
    background: #f1f3f5;
  }

  .status-buttons {
    display: flex;
    gap: 1rem;
  }

  .status-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
    opacity: 0.4;
  }

  .status-btn.active {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: var(--shadow);
  }

  .red { background: var(--red); }
  .orange { background: var(--orange); }
  .green { background: var(--green); }

  .slider-container {
    padding: 1rem 2rem;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
    position: relative;
  }

  .loader {
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--blue);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    position: absolute;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
  }

  @keyframes spin {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
  }

  .content {
    padding: 2rem;
  }

  .note-section {
    margin-bottom: 2rem;
  }

  .fancy-textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    min-height: 100px;
    font-family: inherit;
    transition: border-color 0.3s;
    resize: vertical;
    transition: all 0.3s ease;
    background: #f8f9fa;
    border: 2px solid #e0e0e0;
  }

  .fancy-textarea:focus {
    background: white;
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    outline: none;
  }

  .fancy-textarea::placeholder {
  color: #999;
  font-style: italic;
}


  .file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .file-card {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
  }

  .file-card:hover {
    transform: translateY(-3px);
  }

  .file-preview {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-bottom: 1px solid #dee2e6;
  }

  .file-name {
    padding: 0.75rem;
    font-size: 0.9em;
    text-align: center;
    word-break: break-word;
  }

  .upload-button {
    display: inline-block;
    margin-top: 1rem;
  }

  .upload-button input[type="file"] {
    display: none;
  }

  .upload-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    background: var(--blue);
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .upload-label:hover {
    background: #1976D2;
  }

  .material-section {
    margin-top: 2rem;
    border-top: 1px solid #eee;
    padding-top: 2rem;
  }

  .material-grid {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }



  /* Add these styles */
  .file-card {
    position: relative;
    overflow: hidden;
  }

  .download-overlay {
    position: absolute;
    bottom: -100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    text-align: center;
    padding: 0.5rem;
    transition: bottom 0.3s;
    text-decoration: none;
  }

  .file-card:hover .download-overlay {
    bottom: 0;
  }

  .pdf-preview {
    height: 120px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
</style>
<script>
    import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';

    const pb = new PocketBase('https://sab-roddahn.kruw.de/');

    export let document;

    let loading = false;

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

</script>

<div class="document-card">
  <div class="document-header">
    <h4 class="document-title">{document.name}</h4>
    <div class="document-actions">
      <button 
        class="action-btn seen-btn" 
        class:active={(document?.expand && document?.expand?.["user_datei(datei)"]?.[0].seen)}
        class:loading={loading}
        on:click={() => updateSeen($user.id, document.id, document.expand)}
        title="Als gesehen markieren"
      >
        👁️
      </button>
      <button 
        class="action-btn done-btn" 
        class:active={(document?.expand && document?.expand?.["user_datei(datei)"]?.[0].done)}
        class:loading={loading}
        on:click={() => updateDone($user.id, document.id, document.expand)}
        title="Als erledigt markieren"
      >
        ✓
      </button>
    </div>
  </div>
  
  <div class="document-meta">
    <span class="file-type">{document.file}</span>
  </div>
  
  {#if document.beschreibung}
    <div class="document-description">
      {document.beschreibung}
    </div>
  {/if}
  
  <div class="document-footer">
    <a 
      class="download-btn" 
      href="{`https://sab-roddahn.kruw.de/api/files/${document.collectionName}/${document.id}/${document.file}`}" 
      target="_blank" 
      on:click={() => updateSeen($user.id, document.id, document.expand, false)}
    >
      📥 Herunterladen
    </a>
  </div>
</div>

<style>
  .document-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .document-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .document-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .document-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0;
    flex: 1;
    margin-right: 1rem;
  }

  .document-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .action-btn:hover {
    background: #e9ecef;
    transform: scale(1.1);
  }

  .action-btn.loading {
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

  .document-meta {
    margin-bottom: 1rem;
  }

  .file-type {
    background: #e9ecef;
    color: #495057;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .document-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .document-footer {
    border-top: 1px solid #e9ecef;
    padding-top: 1rem;
  }

  .download-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #007bff;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .download-btn:hover {
    background: #0056b3;
    text-decoration: none;
    color: white;
  }

  .download-btn:active {
    transform: translateY(1px);
  }
</style>
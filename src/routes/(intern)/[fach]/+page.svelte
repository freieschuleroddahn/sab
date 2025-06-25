<script lang="ts">
    import { page } from '$app/stores';
    import PocketBase from 'pocketbase';
    import Kompetenz from '$lib/elements/Kompetenz.svelte';
    import { user } from '$lib/stores/user.js';

    let faecher: Array<Object> = [];
    let offen: any = null;
    let userKompetenzen: Array<Object> = [];
    let showCreateForm = false;
    let newKompetenzName = '';
    let newKompetenzBeschreibung = '';
    let creating = false;
  
      const url = 'https://sab-roddahn.kruw.de/'
      const pb = new PocketBase(url)

async function getFaecher(fach) {
  faecher = await pb.collection('faecher').getFullList({
      sort: '-created',
      filter: `slug = "${fach}"`,
      expand: "themen(fach), themen(fach).kompetenzen(thema), themen(fach).kompetenzen(thema).dateien(kompetenz), themen(fach).kompetenzen(thema).dateien(kompetenz).user_datei(datei), themen(fach).kompetenzen(thema).user_kompetenz(kompetenz),, themen(fach).kompetenzen(thema).user_kompetenz_datei(kompetenz)"
  });
  console.log('faecher', faecher);
}
$: getFaecher($page.params.fach);

async function getCustomUserKompetenz(fach) {
      if($user.id==undefined) {
        return;
      }
      userKompetenzen = await pb.collection('eigene_kompetenzen').getFullList({
        filter: `fach.slug = "${fach}"`,
        expand: "fach"
      });
      console.log('userKompetenzen', userKompetenzen);
    }
    $: getCustomUserKompetenz($page.params.fach);

    async function createUserKompetenz() {
      if (!newKompetenzName.trim() || !$user.id) {
        return;
      }
      
      creating = true;
      try {
        const fachRecord = faecher.find(f => f.slug === $page.params.fach);
        if (!fachRecord) {
          throw new Error('Fach not found');
        }

        const newKompetenz = await pb.collection('eigene_kompetenzen').create({
          name: newKompetenzName.trim(),
          beschreibung: newKompetenzBeschreibung.trim(),
          fach: fachRecord.id,
          user: $user.id
        });

        // Add to local array with expanded fach data
        newKompetenz.expand = {
          fach: fachRecord
        };
        userKompetenzen = [...userKompetenzen, newKompetenz];
        
        // Reset form
        newKompetenzName = '';
        newKompetenzBeschreibung = '';
        showCreateForm = false;
      } catch (error) {
        console.error('Failed to create competency:', error);
      } finally {
        creating = false;
      }
    }
      
</script>

{#each faecher as fach}

  <h2>
    {fach.name}
  </h2>

  {@html fach.beschreibung}

  {#if fach.expand?.["themen(fach)"]}
    {#each fach.expand["themen(fach)"] as thema}
      <h3 class="pointer header" 
      class:opened={offen == thema.id}
      on:click={()=>{
        if(offen == thema.id){
          offen = null
        } else{
          offen = thema.id
        }
        
        }}>
          <div class="arrow">⮞</div>
          {thema.name}
        </h3>

      {#if thema.expand && offen == thema.id}
        {#if thema.expand?.["kompetenzen(thema)"]}
          {#each thema.expand["kompetenzen(thema)"] as data}
          <!-- {JSON.stringify(data)} -->
            <Kompetenz data={data} />
          {/each}
        {/if}
      {/if}

    {/each}
  {/if}

  <h3 class="pointer header">
          Selbst erstellte Kompetenzen
    </h3>

  <div class="create-section">
    <button 
      class="create-btn" 
      on:click={() => showCreateForm = !showCreateForm}
      disabled={!$user.id}
    >
      {showCreateForm ? 'Abbrechen' : '+ Neue Kompetenz erstellen'}
    </button>

    {#if showCreateForm}
      <div class="create-form">
        <div class="form-group">
          <label for="kompetenz-name">Name der Kompetenz:</label>
          <input 
            id="kompetenz-name"
            type="text" 
            bind:value={newKompetenzName} 
            placeholder="z.B. Quadratische Gleichungen lösen"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="kompetenz-beschreibung">Beschreibung (optional):</label>
          <textarea 
            id="kompetenz-beschreibung"
            bind:value={newKompetenzBeschreibung} 
            placeholder="Beschreibe was diese Kompetenz beinhaltet..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button 
            class="save-btn" 
            on:click={createUserKompetenz}
            disabled={!newKompetenzName.trim() || creating}
          >
            {creating ? 'Erstelle...' : 'Kompetenz erstellen'}
          </button>
        </div>
      </div>
    {/if}
  </div>

  {#if userKompetenzen.length === 0 && !showCreateForm}
    <p class="no-competencies">Noch keine eigenen Kompetenzen erstellt. Erstelle deine erste Kompetenz!</p>
  {/if}

  {#each userKompetenzen as kompetenz}
  <!-- {JSON.stringify(kompetenz)} -->
    <Kompetenz data={kompetenz} />
  {/each}

{/each}

<style>
  
  .header:hover{
        opacity: 0.5;
  }
  .header .arrow{
      display: inline-block;
      transition: all 0.1s ease-out;
  }
  .header.opened .arrow{
    transform: rotate(90deg);
  }

  .create-section {
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #f9f9f9;
  }

  .create-btn {
    background: #007acc;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .create-btn:hover:not(:disabled) {
    background: #005a9e;
  }

  .create-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .create-form {
    margin-top: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    font-family: inherit;
    box-sizing: border-box;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .save-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .save-btn:hover:not(:disabled) {
    background: #218838;
  }

  .save-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .no-competencies {
    padding: 1rem;
    text-align: center;
    color: #666;
    font-style: italic;
    background: #f5f5f5;
    border-radius: 4px;
    margin: 1rem 0;
  }
</style>

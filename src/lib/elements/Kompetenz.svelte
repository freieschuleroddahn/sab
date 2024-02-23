<script>
  import PocketBase from 'pocketbase';

  export let data;
  let active = false;
  let files;

  const url = 'https://sab.pockethost.io/'
  const pb = new PocketBase(url)

  async function getFiles(id) {
    const files = await pb.collection('dateien').getFullList({
        sort: '-created',
        filter: `kompetenz = "${id}"`,
        expand: "thema"
    });
    console.log(files)
    return files;
  }

  function toggleKompetenz(){
    active=!active;
    if(active) {
      files = getFiles(data.id)
    }
  }
</script>

<div class="ui fluid cards">
    <div class="ui fluid card">
      <div class="content">
        <div class="right floated">
            <div class="ui buttons">
                <div class="ui basic red button">Kennengelernt</div>
                <div class="ui basic orange button">Geübt</div>
                <div class="ui basic green button">Beherscht</div>
              </div>
        </div>
        <!-- <img class="right floated mini ui image" src="/images/avatar/large/elliot.jpg"> -->
        <div class="header" on:click={toggleKompetenz}>
          {data.name}
        </div>
        <div class="meta">
          L1, L2
        </div>

        {#if active}
        <div class="description">
          {@html data.beschreibung}
        </div>
        
        {#await files}
          Lade Dateien
        {:then f}
        <div class="ui cards">
            {#each f  as document}
            <!-- ['Arbeitsblatt (pdf/.docx)','Video (mp4)','Bild'] -->
            <div class="card">
              <div class="content">
                <i class="right floated check icon" class:green={document.done} on:click={()=>{document.done=!document.done}}></i>
                <i class="right floated eye icon"  class:green={document.downloaded}></i>
                <div class="header">{document.name}</div>
                <div class="meta">
                    <span class="category">{document.file}</span>
                  </div>
                <div class="description">
                  {document.beschreibung}
                </div>
              </div>
              <a class="ui button" href="{`https://sab.pockethost.io/api/files/${document.collectionName}/${document.id}/${document.file}`}" target="_blank" on:click={()=>{document.downloaded=true}}>
                <i class="download icon"></i>
                Herunterladen
              </a>
            </div>
            {:else}
              Keine Dateien
            {/each}
          </div>
          {/await}
          {/if}


      </div>
      {#if active}
      <div class="extra content">
        Optional Fotos/Dateien hochladen zur persöhnlichen Dokumentation
      </div>
      {/if}
    </div>
  </div>

  <style>
    .description {
      margin: 2rem 0;
    }
  </style>
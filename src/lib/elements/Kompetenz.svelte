<script>
	import Datei from '$lib/elements/Datei.svelte';

  export let data;

  let opened = false;


  
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
        <div class="header pointer" on:click={()=>{opened = !opened}}>
          {data.name}
        </div>
        <div class="meta">
          L1, L2
        </div>

     {#if opened}
    
          <div class="description">
            {@html data.beschreibung}
          </div>

          {#if data.expand}
            <div class="ui cards">
              {#each data.expand["dateien(kompetenz)"] as document}
                <Datei {document} />
              {/each}
            </div>
          {/if} 

        {/if}

      </div>
      {#if opened}
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
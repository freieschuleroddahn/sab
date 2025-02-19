<script>
      import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';

    const url = 'https://sab.pockethost.io/'
    const pb = new PocketBase(url)


	import Datei from '$lib/elements/Datei.svelte';

  const pb = new PocketBase('https://sab-roddahn.kruw.de/');

  export let data;

  let opened = false;

  let wert = [0]; 
  let loading = false;

  async function saveWert() {
      loading = true;
      const data = {
          "user": $user.id,
          "kompetenz": data.collectionId,
          "wert": wert[0]
      };

  //    if(true == undefined) {
  //      // create data
  //      const record = await pb.collection('user_kompetenz').create(data);
  //    } else {
  //      const record = await pb.collection('user_datei').update(userDateiID, data);
  //    }
    }
  
</script>

<div class="ui fluid cards">
    <div class="ui fluid card">
      <div class="content">
        <div class="right floated">
            <div class="ui buttons">
                <div class="ui basic red button"style="
                     width: 60px; 
                    font-size: 0.7rem;
                    ">kenne</div>
                <div class="ui basic orange button"style="
                 width: 120px; 
                font-size: 0.7rem;
                ">übe</div>
                <div class="ui basic green button"style="
                 width: 60px; 
                font-size: 0.7rem;
                ">kann</div>
              </div>
              <RangeSlider min={0} max={1000} bind:values={wert} on:change={saveWert} />
        </div>
        <!-- <img class="right floated mini ui image" src="/images/avatar/large/elliot.jpg"> -->
        <div class="header pointer" on:click={()=>{opened = !opened}}>
          {data.name}
        </div>
        <div class="meta">
          L1, L2
        </div>
        <pre>{JSON.stringify(data,0,2)}</pre>
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
<script>
      import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';
  import RangeSlider from 'svelte-range-slider-pips';
	import Datei from '$lib/elements/Datei.svelte';

  const pb = new PocketBase('https://sab-roddahn.kruw.de/');

  export let data;

  let opened = false;


  // let ukFiles = [];
  let wert = [0];
  let userKompetenzRecord;
  
  $: {
    const uk = data?.expand?.['user_kompetenz(kompetenz)']?.[0] || {};
    userKompetenzRecord = uk;
    wert = [uk?.wert || 0];
  }

  let loading = false;

  async function saveWert(e) {
      loading = true;
      const newData = {
          "user": $user.id,
          "kompetenz": data.id,
          "wert": e.detail.values[0]
      };

     if(userKompetenzRecord?.id) {
      userKompetenzRecord = await pb.collection('user_kompetenz').update(userKompetenzRecord.id, newData);
     } else {
      // create data
      userKompetenzRecord = await pb.collection('user_kompetenz').create(newData);
     }
    }
  
</script>

<!-- <pre>{JSON.stringify(data,0,2)}</pre> -->

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
              <RangeSlider min={0} max={1000} values={wert} on:change={saveWert} />
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
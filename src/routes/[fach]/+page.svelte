<script lang="ts">
    import { page } from '$app/stores';
    import PocketBase from 'pocketbase';
    import Kompetenz from '$lib/elements/Kompetenz.svelte';

    let faecher = [];
    let offen: any = null;
  
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
      <button class="ui mini purple icon button">
        <i class="plus icon"></i>
      </button>
        {#if thema.expand?.["kompetenzen(thema)"]}
          {#each thema.expand["kompetenzen(thema)"] as data}
            <Kompetenz data={data} />
          {/each}
        {/if}
      {/if}

    {/each}
  {/if}

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
</style>

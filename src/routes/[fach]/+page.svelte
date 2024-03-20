<script>
    import { page } from '$app/stores';
    import PocketBase from 'pocketbase';
    import Kompetenz from '$lib/elements/Kompetenz.svelte';

    let faecher = [];
    let offen = null;
  
      const url = 'https://sab.pockethost.io/'
      const pb = new PocketBase(url)

      async function getFaecher() {
        faecher = await pb.collection('faecher').getFullList({
            sort: '-created',
            filter: `slug = "${$page.params.fach}"`,
            expand: "themen(fach), themen(fach).kompetenzen(thema), themen(fach).kompetenzen(thema).dateien(kompetenz)"
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

  {#if fach.expand}
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
        {#each thema.expand["kompetenzen(thema)"] as data}
          <Kompetenz data={data} />
        
        {/each}
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



  
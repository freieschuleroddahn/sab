<script>
  import { page } from '$app/stores';
  import PocketBase from 'pocketbase';

  let fachbereiche = [];

  const url = 'https://sab.pockethost.io/'
      const pb = new PocketBase(url)
      async function getFaecher() {
        fachbereiche = await pb.collection('fachbereiche').getFullList({
            sort: '-created',
            expand: "faecher(fachbereich)"
        });
        console.log('fachbereiche', fachbereiche);
      }

      getFaecher();

let active;
</script>

<div class="">

  {#each fachbereiche as fachbereich}
    <div class="item">
      <div 
           class="header"
           class:opened={(active == fachbereich.id) && (fachbereich.expand)}
           on:click={()=>{active = fachbereich.id}}
      >
        <div class="arrow">⮞</div>
         {fachbereich.name}
      </div>

      <div class="menu">
        {#if (active == fachbereich.id) && (fachbereich.expand)}
          {#each fachbereich.expand["faecher(fachbereich)"] as seite}
              <a class="item" href="{seite.slug}" class:active={$page.url.pathname == seite.slug}>
                {seite.name}
              </a>
          {/each}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .header {
      padding: 0.5rem 0;
      font-weight: bold; 
  }
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
  .menu{
    margin-left: 1rem;
  }
 .item {
  cursor: pointer;
  display: block;
 }
</style>
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

<div class="ui secondary vertical pointing menu">

  {#each fachbereiche as fachbereich}
    <div class="item">
      <div class="header" on:click={()=>{active = fachbereich.id}}>
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

<style>
  /* .header {
    border-top: 1px solid black !important;
  }

  .subitems {
    margin-left: 1rem;
  } */
</style>
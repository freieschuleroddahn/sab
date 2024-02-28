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

</script>

<div class="ui secondary vertical pointing menu">

  {#each fachbereiche as fachbereich} 
    <div class="header item">{fachbereich.name}</div>
    {#if fachbereich.expand}
      {#each fachbereich.expand["faecher(fachbereich)"] as seite}
          <a class="item" href="{seite.slug}" class:active={$page.url.pathname == seite.slug}>
            {seite.name}
          </a>
      {/each}
    {/if}
    
  {/each}
</div>
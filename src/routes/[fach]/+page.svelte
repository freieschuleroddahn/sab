<script>
    import { page } from '$app/stores';
    import PocketBase from 'pocketbase';
    import Kompetenz from '$lib/elements/Kompetenz.svelte';

    let faecher = [];

    console.log("PAGE", $page)

  
      const url = 'https://sab.pockethost.io/'
      const pb = new PocketBase(url)

      async function getFaecher() {
        faecher = await pb.collection('faecher').getFullList({
            sort: '-created',
            filter: `slug = "${$page.params.fach}"`,
            expand: "themen(fach)"
        });
        console.log('faecher', faecher);
      }

      getFaecher();
      
</script>

{#each faecher as fach}

  <h2>
    {fach.name}
  </h2>

  {@html fach.beschreibung}

  {#each fach.expand["themen(fach)"] as thema}
    <h3>{thema.name}</h3>

    <Kompetenz />

  {/each}

{/each}





  
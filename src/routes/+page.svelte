<script>
	import Box from "$lib/elements/Box.svelte";

    import PocketBase from 'pocketbase';

let fachbereiche = [];
let active;

const pb = new PocketBase('https://sab-roddahn.kruw.de/');

async function getFaecher() {
  try {
    fachbereiche = await pb.collection('fachbereiche').getFullList({
      sort: '-created',
      expand: "faecher(fachbereich)"
    });
    console.log('Fachbereiche loaded:', fachbereiche);
  } catch (error) {
    console.error('Error loading Fachbereiche:', error);
  }
}

getFaecher();
</script>


<div class="main">
{#each fachbereiche as fachbereich}
    <div class="container">
      <div 
           class="header"
           class:opened={(active == fachbereich.id) && (fachbereich.expand)}
           on:click={()=>{active = fachbereich.id}}
      >
         <h2>{fachbereich.name}</h2>
      </div>

      <div class="menu">
        
          {#each fachbereich.expand["faecher(fachbereich)"] as seite}
              <a class="item" href="{seite.slug}">
                 ⮞ {seite.name}
              </a>
          {/each}
       
      </div>
    </div>
  {/each}
</div>



<style lang="scss">

//  --background
//    --text
//    --primary

  .main {
    //background-color: rgb(241, 5, 5);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
    .container {
      background-color: rgba(124, 124, 124, 0.158);
      border-radius: var(--border-radius);
      transition: all 0.2s;
      &:hover {
       background-color: hsl(var(--primary-color), 50%, 90%);
      }
      
    }
    .header {
      background-color: hsl(var(--primary-color), 50%, 50%);
      
      border-radius: var(--border-radius) var(--border-radius) 0 0;
      padding: 1em;
      margin-bottom: 1em;
      h2 {
        font-size: 1.3rem;
        color: var(--text-on-primary);
      }
    }

    a.item {
      background-color: var(--background);
        margin: 10px 1rem;
        padding: 1em;
        border-radius: calc(var(--border-radius) / 3 * 2);
        display: block;
        color: var(--text);
        transition: all 0.3s;
        &:hover {
          background-color: hsl(var(--primary-color), 50%, 50%);
          color: var(--text-on-primary);
        }
    }

}
  


</style>
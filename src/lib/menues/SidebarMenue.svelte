<script>
  import { page } from '$app/stores';
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

<div>
  <!-- Profile Link -->
  <div class="item profile-link">
    <a href="/profile" class:active={$page.url.pathname === '/profile'}>
      📝 Profil bearbeiten
    </a>
  </div>

  {#each fachbereiche as fachbereich}
    <div class="item">
      <div 
           class="header"
           class:opened={(active == fachbereich.id) && (fachbereich.expand)}
           on:click={()=>{active = fachbereich.id}}
      >
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

 a {color: black;}

 a:hover {
  opacity: 0.5;
 }

  .profile-link {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .profile-link a {
    font-weight: 600;
    color: #666;
    text-decoration: none;
    display: block;
    padding: 0.5rem 0;
  }
  
  .profile-link a:hover {
    color: #333;
    opacity: 0.8;
  }
  
  .profile-link a.active {
    color: hsl(var(--primary-color, 200), 70%, 50%);
    font-weight: bold;
  }
</style>


<script>
    import "../app.css";
	import SidebarMenu from "$lib/menues/SidebarMenue.svelte";
    import { user } from '$lib/stores/user.js';

    import PocketBase from 'pocketbase';
    const url = 'https://sab-roddahn.kruw.de/'
    const pb = new PocketBase(url)
</script>



<div>

    <aside>
         <h1>
            Schüler*innen<br/>
            Arbeitsbuch
        </h1>
    {#if $user.id == undefined}
        <a href="/login">Login</a>
    {:else}
        <button on:click={()=>{$user={}; pb.authStore.clear();}}>Logout</button>
        {$user?.name}
    {/if}
        <h2>Menü</h2>
        <SidebarMenu />
    </aside>
        
    <main class="ui container">
        <slot />
    </main>
    
</div>

<footer></footer>

<style>

div {
    display: flex;
    align-items: flex-start;
    min-height: 100vh;
}

header {
    width: 100%;
    padding: 10px;
    text-align: center;
    position: sticky;
    top:0;
    background: white;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    z-index: 99;
}

main {
    width: 75%;
    padding: 0 5%;
    padding: 1rem;
}

aside {
    width: 25%;
    max-width: 200px;
    min-width: 150px;
    position: sticky;
    padding: 1rem;
    top:0px;
}

footer {
    width: 100%;
    height: 300px;
  
} 
</style>
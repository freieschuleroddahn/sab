<script>
	import SidebarMenu from "$lib/menues/SidebarMenue.svelte";
    import { user } from '$lib/stores/user.js';
    import ThemeSelect from "$lib/components/ThemeSelect.svelte";
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    import PocketBase from 'pocketbase';
    const url = 'https://sab-roddahn.kruw.de/'
    const pb = new PocketBase(url)

    let color = $user.theme_color_hue || 200;

    // Update color when user store changes
    $: color = $user.theme_color_hue || 200;

    $: if(!$user.id && browser) {
        goto("/login", {
            "replaceState": true
        });
    }

</script>

<div class="theme-container" style="--primary-color: {color}">


<div class="main-content">

    <aside>
         <a href="/">
            <h1>
                Schüler*innen<br/>
                Arbeitsbuch
            </h1>
        </a>
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

</div>

<style>

.main-content {
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
<script>
    import "../app.css";
	import MainMenue from "$lib/menues/MainMenue.svelte";
	import SidebarMenu from "$lib/menues/SidebarMenue.svelte";

</script>

<header>
    <h1>Schüler*innen-Arbeitsbuch</h1>
   <MainMenue />
</header>

<div>

    <aside>
        <h2>Sidebar</h2>
        <SidebarMenu />

        <MainMenue />
    </aside>
        
    <main class="ui container">
        <slot />
    </main>
    
</div>

<footer>Footer</footer>

<style>

div {
    display: flex;
    align-items: flex-start;
    min-height: 100vh;
}

header {
    width: 100%;
    height: 100px;
    text-align: center;
    position: sticky;
    top:0;
    background: white;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    z-index: 99;
}

main {
    width: 65%;
    padding: 0 5%;
    padding: 1rem;
}

aside {
    width: 25%;
    position: sticky;
    padding: 1rem;
    top:100px;
}

footer {
    width: 100%;
    height: 300px;
    background: rgb(170, 0, 255);
} 
</style>
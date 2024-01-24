<script>
    import "../app.css";
</script>

<header>
    <h1>Top</h1>
    <a href="/">Seite 1</a>
    <a href="/seite2">Seite 2</a>
</header>

<div>

    <aside>
        <h2>Sidebar</h2>
        <div class="ui vertical pointing   menu">
            <a class="item">
              Home
            </a>
            <a class="item">
              Messages
            </a>
            <a class="item active">
              Friends
            </a>
          </div>
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
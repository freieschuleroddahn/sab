<script>
  import { page } from '$app/stores';

  let pages = [
    {
      name: "Home",
      slug: "/"
    },
    {
      name: "Seite 2",
      slug: "/seite2"
    },
    {
      name: "Mathe",
      slug: "/mathe"
    }
  ]
</script>

<div class="ui secondary vertical pointing menu">
  {#each pages as seite} 
    <a class="item" href="{seite.slug}" class:active={$page.url.pathname == seite.slug}>
      {seite.name}
    </a>
  {/each}
</div>
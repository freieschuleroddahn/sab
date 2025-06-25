<script>
        import "$lib/../app.css";
        import { Confetti } from "svelte-confetti";
        import { user } from '$lib/stores/user.js';
</script>


<slot />

{#if $user?.id}

<div class="centered">
    <Confetti x={[-3.5, 3.5]} y={[0.5, 3.5]} delay={[0, 500]}  duration=2000 amount=500  size=10 />
  </div>

{/if}



<style lang="scss">


  .centered {
    position: absolute;
    top:100vh;
    left:50%;
  }

</style>

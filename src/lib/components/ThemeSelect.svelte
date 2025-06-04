<script>
    import { onMount } from 'svelte';

   export let color = null;
   let myColor = 0;
   let mounted = false;

   onMount(() => {
    
        const prefferredColor = window.sessionStorage.getItem("prefferredColor");
        if (prefferredColor) {
            color = prefferredColor;
            myColor = prefferredColor;
        } else {
            color = 0;
        }
        mounted = true;
   });

   function saveColor(c) {
    if(!mounted || c == null) return;
    color = c;
    window.sessionStorage.setItem("prefferredColor", c+"");
   }

   $: saveColor(myColor);

</script>



<input type="range" min="0" max="360" bind:value={myColor} class="slider" >
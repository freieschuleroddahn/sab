<script lang="ts">
    import { onMount } from 'svelte';
    import { user } from '$lib/stores/user.js';
    import PocketBase from 'pocketbase';

    export let color = null;
    let myColor = 0;
    let mounted = false;

    const pb = new PocketBase('https://sab-roddahn.kruw.de/');

    onMount(() => {
        // Use user's theme color if available, otherwise fallback to session storage
        if ($user.theme_color_hue !== undefined) {
            myColor = $user.theme_color_hue;
            color = $user.theme_color_hue;
        } else {
            const prefferredColor = window.sessionStorage.getItem("prefferredColor");
            if (prefferredColor) {
                color = parseInt(prefferredColor);
                myColor = parseInt(prefferredColor);
            } else {
                color = 200;
                myColor = 200;
            }
        }
        mounted = true;
    });

    async function saveColor(c: number) {
        if (!mounted || c == null) return;
        
        color = c;
        
        // Save to session storage for immediate feedback
        window.sessionStorage.setItem("prefferredColor", c + "");
        
        // If user is logged in, save to their profile
        if ($user.id) {
            try {
                const updatedUser = await pb.collection('users').update($user.id, {
                    theme_color_hue: c
                });
                // Update the user store
                $user = { ...$user, theme_color_hue: c };
            } catch (error) {
                console.error('Error saving theme color:', error);
            }
        }
    }

    $: saveColor(myColor);
</script>

<input type="range" min="0" max="360" bind:value={myColor} class="slider" >
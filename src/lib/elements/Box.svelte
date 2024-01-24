<script>
    export let color = "red";
</script>

<div style="--color: {color}">
    <slot />
</div>

<style>
    div {
        background-color: var(--color);
        width: 100%;
        padding: 1rem;
        border-radius: 3px;
        margin: 1rem 0;
    }
</style>
<script>
    export let _id = 0;
    import { drawerActive } from "$lib/stores";
</script>

<div class:active={$drawerActive}>

</div>

<style>
    div {
        background-color: #222222;
        inset: 0;
        position: fixed;
        translate: 0 100%;
        border-radius: 1rem;
        transition: all 150ms ease-in-out;
    }

    .active {
        translate: 0 70%;
    }
</style>
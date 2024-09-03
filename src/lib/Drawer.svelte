<script>
    export let _id = 0;
    import { isDrawerActive } from "$lib/stores";
</script>

<div class="drawer" class:active={$isDrawerActive}>
    <p>This would be the task's content</p>
    <p class="date">Created: Sun 12/4 10:34 AM</p>
    <p class="date">Last Updated: Sun 12/4 10:34 AM</p>
    <p>Important</p>
    <p>Completed</p>
    <p>Delete </p>
</div>

<style>
    div {
        background-color: #222222;
        inset: 0;
        position: fixed;
        translate: 0 100%;
        /* translate: 0 70%; */
        border-radius: 1rem;
        transition: all 150ms ease-in-out;
        padding: 1rem;
    }

    .active {
        translate: 0 70%;
    }

    .date {
        color: #757575;
    }
</style>
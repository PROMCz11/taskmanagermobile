<script>
    export let _id = 0;
    import { isDrawerActive } from "$lib/stores";

    const drawerClickHandler = e => {
        if(e.target.classList.contains("drawer-wrapper")) {
            $isDrawerActive = false;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={drawerClickHandler} class="drawer-wrapper" class:active={$isDrawerActive}>
    <div class="drawer">
        <p>This would be the task's content</p>
        <p class="date">Created: Sun 12/4 10:34 AM</p>
        <p class="date">Last Updated: Sun 12/4 10:34 AM</p>
        <p>Important</p>
        <p>Completed</p>
        <p>Delete </p>
    </div>
</div>

<style>
    .drawer-wrapper {
        position: fixed;
        inset: 0;
        transition: all 150ms ease-in-out;
        translate: 0 100%;
        background-color: rgba(0, 0, 0, .4);
    }

    .drawer {
        background-color: #222222;
        inset: 60% 0 0 0;
        position: fixed;
        border-radius: 1rem;
        padding: 1rem;
    }

    .active {
        translate: 0;
    }

    .date {
        color: #757575;
    }
</style>
<script>
    export let _id = 0;
    import { isDrawerActive } from "$lib/stores";
    import deleteIconSrc from "$lib/assets/delete-icon.svg"

    const drawerClickHandler = e => {
        if(e.target.classList.contains("drawer-wrapper") && $isDrawerActive) {
            $isDrawerActive = false;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={drawerClickHandler} class="drawer-wrapper" class:active={$isDrawerActive}>
    <div class="drawer">
        <!-- <p>This would be the task's content</p> -->
         <div>
            <p class="date">Created: Sun 12/4 10:34 AM</p>
            <p class="date">Last Updated: Sun 12/4 10:34 AM</p>
        </div>
        <div class="indicator-container">
            <div class="important-indicator">
                <div class="circle"></div>
                <p>Important</p>
            </div>
            <div class="completed-indicator">
                <div class="circle"></div>
                <p>Completed</p>
            </div>
        </div>
        <button class="delete">
            <img src={deleteIconSrc} alt="delete">
            <p>Delete</p>
        </button>
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
        background-color: #1A1A1A;
        inset: 60% 0 0 0;
        position: fixed;
        border-top-right-radius: 1rem;
        border-top-left-radius: 1rem;
        padding: 1rem;
        border: 2px solid #757575;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .active {
        translate: 0;
    }

    .date {
        color: #757575;
    }

    .indicator-container {
        display: flex;
        gap: .5rem;
    }
    
    .important-indicator .circle {
        background-color: red;
    }
    
    .completed-indicator .circle {
        background-color: green;
    }

    .important-indicator,
    .completed-indicator {
        display: flex;
        align-items: center;
        gap: .5rem;
        padding: .6rem;
        background-color: #222222;
        max-width: max-content;
        border-radius: 1rem;
    }

    button.delete {
        color: #FC4850;
        display: flex;
        align-items: center;
        max-width: max-content;
    }
</style>
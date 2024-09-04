<script>
    export let important = false;
    export let completed = false;

    import uncheckedRadioSrc from "$lib/assets/task-radio-unchecked-icon.svg"
    import checkedRadioSrc from "$lib/assets/task-radio-checked-icon.svg"
    import menuIconSrc from "$lib/assets/menu-icon.svg"

    import { isDrawerActive } from "$lib/stores";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="task" class:important class:completed>
    <button on:click={() => {
        if(!$isDrawerActive) {
            $isDrawerActive = true;
        }
    }}><img src={menuIconSrc} alt="menu"></button>
    <div>
        <p class="content" contenteditable>This would be the task's content</p>
        <p class="date">Sun 12/4 10:34 AM</p>
    </div>
    <button on:click={() => completed = !completed} class="completed-toggle"><img src={completed ? checkedRadioSrc : uncheckedRadioSrc} alt="complete"></button>
</div>

<style>
    .task {
        border: 2px solid transparent;
        border-radius: .5rem;
        background-color: #222222;
        padding: .5rem;
        display: flex;
        /* justify-content: space-between; */
        gap: .5rem;
        align-items: center;
    }

    .date {
        color: #757575;
    }

    .task.important {
        border-color: red;
    }

    .task.completed {
        border-color: green;
    }

    .task.completed .content {
        text-decoration: line-through;
    }

    .completed-toggle {
        margin-left: auto;
    }
</style>
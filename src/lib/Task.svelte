<script>
    export let important = false, completed = false, _id = 0, content = "", date = 0, last_updated = 0;

    import uncheckedRadioSrc from "$lib/assets/task-radio-unchecked-icon.svg"
    import checkedRadioSrc from "$lib/assets/task-radio-checked-icon.svg"
    import menuIconSrc from "$lib/assets/menu-icon.svg"

    import { isDrawerActive } from "$lib/stores";

    const getFormattedLocalTime = (millisecondsSinceEpoch) => {
        const dateFromMilliseconds = new Date(millisecondsSinceEpoch);
        const options = {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        const formattedLocalTime = dateFromMilliseconds.toLocaleTimeString(undefined, options).split(",").join("");
        return formattedLocalTime;
    }

    const openDrawer = () => {
        if(!$isDrawerActive) {
            $isDrawerActive = true;
        }
    }

    const toggleCompleted = () => {
        completed = !completed;
        last_updated = new Date().getTime();
        // send to the server
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="task" class:important class:completed>
    <button on:click={openDrawer}><img src={menuIconSrc} alt="menu"></button>
    <div>
        <p class="content" bind:textContent={content} contenteditable></p>
        <p class="date">{getFormattedLocalTime(date)}</p>
    </div>
    <button on:click={toggleCompleted} class="completed-toggle"><img src={completed ? checkedRadioSrc : uncheckedRadioSrc} alt="complete"></button>
</div>

<style>
    .task {
        border: 2px solid transparent;
        border-radius: .5rem;
        background-color: #222222;
        padding: .5rem;
        display: flex;
        gap: .5rem;
        align-items: center;
    }

    .content {
        max-width: 65vw;
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
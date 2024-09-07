<script>
    // export let _id = 0;
    import { isDrawerActive } from "$lib/stores";
    import { IDForDrawer } from "$lib/stores";
    import { tasks } from "$lib/stores";
    import deleteIconSrc from "$lib/assets/delete-icon.svg"
    import { token } from "$lib/stores";

    const closeDrawer = e => {
        if(e.target.classList.contains("drawer-wrapper") && $isDrawerActive) {
            $isDrawerActive = false;
        }
    }

    let date, last_updated, important, completed, index, _id;
    const updateDrawer = () => {
        if($IDForDrawer) {
            const displayedTask = $tasks.find(task => task._id === $IDForDrawer);

            date = displayedTask.date;
            last_updated = displayedTask.last_updated;
            important = displayedTask.important;
            completed = displayedTask.completed;
            _id = displayedTask._id;

            index = $tasks.indexOf(displayedTask);
        }
    }

    $: $IDForDrawer, $tasks, updateDrawer();

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

    const toggleImportant = () => {
        $tasks[index].important = !$tasks[index].important;
        const last_updated = new Date().getTime();
        $tasks[index].last_updated = last_updated;
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/update/${_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                token: $token,
                important: $tasks[index].important,
                last_updated: last_updated
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    const toggleCompleted = () => {
        $tasks[index].completed = !$tasks[index].completed;
        const last_updated = new Date().getTime();
        $tasks[index].last_updated = last_updated;
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/update/${_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                token: $token,
                completed: $tasks[index].completed,
                last_updated: last_updated
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    const deleteTask = (toBeDeletedArray) => {

        $isDrawerActive = false;

        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/delete`, {
            method: "DELETE",
            body: JSON.stringify({
                token: $token,
                ids: toBeDeletedArray
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err))

        const _idShell = _id;
        $IDForDrawer = "";
        $tasks = $tasks.filter(task => task._id != _idShell);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={closeDrawer} class="drawer-wrapper" class:active={$isDrawerActive}>
    <div class="drawer">
         <div>
            <p class="date">Created: {getFormattedLocalTime(date)}</p>
            <p class="date">Last Updated: {getFormattedLocalTime(last_updated)}</p>
        </div>
        <div class="indicator-container">
            <div on:click={toggleImportant} class:active={important} class="important-indicator">
                <div class="circle"></div>
                <p>Important</p>
            </div>
            <div on:click={toggleCompleted} class:active={completed} class="completed-indicator">
                <div class="circle"></div>
                <p>Completed</p>
            </div>
        </div>
        <button on:click={() => deleteTask([_id])} class="delete">
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
        background-color: var(--clr-primary-dark);
        inset: 60% 0 0 0;
        position: fixed;
        border-top-right-radius: 1rem;
        border-top-left-radius: 1rem;
        padding: 1rem;
        border: 2px solid #757575;
        border-bottom: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .drawer-wrapper.active {
        translate: 0;
    }

    .date {
        color: #757575;
    }

    .indicator-container {
        display: flex;
        gap: .5rem;
    }
    
    .important-indicator.active .circle {
        background-color: var(--clr-accent);
    }
    
    .completed-indicator.active .circle {
        background-color: var(--clr-green);
    }

    .important-indicator,
    .completed-indicator {
        display: flex;
        align-items: center;
        gap: .5rem;
        padding: .6rem;
        background-color: var(--clr-primary-light);
        max-width: max-content;
        border-radius: 1rem;
    }

    button.delete {
        color: var(--clr-red);
        display: flex;
        align-items: center;
        max-width: max-content;
    }
</style>
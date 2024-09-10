<script>
    export let important = false, completed = false, _id = 0, content = "", date = 0, last_updated = 0;

    import uncheckedRadioSrc from "$lib/assets/task-radio-unchecked-icon.svg"
    import checkedRadioSrc from "$lib/assets/task-radio-checked-icon.svg"
    import menuIconSrc from "$lib/assets/menu-icon.svg"

    import { isDrawerActive } from "$lib/stores";
    import { IDForDrawer } from "$lib/stores";
    import { token } from "$lib/stores";
    import { accountInformation } from "$lib/stores";
    import { tasks } from "$lib/stores";
    import { isClientOnline } from '$lib/stores';
    import { offlineData } from '$lib/stores';

    import { fade } from "svelte/transition";

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
            $IDForDrawer = _id;
            $isDrawerActive = true;
        }
    }

    const toggleCompleted = () => {
        if($isClientOnline) {
            if($accountInformation.auto_delete && !completed) {
                fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/delete`, {
                    method: "DELETE",
                    body: JSON.stringify({
                        token: $token,
                        ids: [_id]
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })

                $tasks = $tasks.filter(task => task._id != _id);
            }
            
            else {
                completed = !completed;
                last_updated = new Date().getTime();
                fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/update/${_id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        token: $token,
                        completed: completed,
                        last_updated: last_updated
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
            }
        }

        else {
            if($accountInformation.auto_delete && !completed) {
                $offlineData.deletedWhileOfflineIDS = [...$offlineData.deletedWhileOfflineIDS, _id];

                $tasks = $tasks.filter(task => task._id != _id);
            }

            else {
                completed = !completed;
                last_updated = new Date().getTime();

                const indexOfPreviouslyUpdatedTask = $offlineData.updatedWhileOfflineTasksArray.findIndex(task => task._id === _id);
                if(indexOfPreviouslyUpdatedTask === -1) {
                    const newUpdatedTask = {
                        "_id": _id,
                        "completed": completed,
                        "last_updated": last_updated
                    }
                    $offlineData.updatedWhileOfflineTasksArray = [...$offlineData.updatedWhileOfflineTasksArray, newUpdatedTask];
                }
                else {
                    $offlineData.updatedWhileOfflineTasksArray[indexOfPreviouslyUpdatedTask].completed = completed;
                    $offlineData.updatedWhileOfflineTasksArray[indexOfPreviouslyUpdatedTask].last_updated = last_updated;
                }
            }
        }
    }

    const handleInput = e => {
        if(e.key === "Enter") {
            e.preventDefault();
            e.target.blur()
        }
    }

    const blurHandler = e => {
        const newContent = e.target.textContent;
        updateTaskContent(newContent);
    }

    const updateTaskContent = (newContent) => {
        if($isClientOnline) {
            last_updated = new Date().getTime();
            fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/update/${_id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    token: $token,
                    content: newContent,
                    last_updated: last_updated
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
        }

        else {
            last_updated = new Date().getTime();

            const indexOfPreviouslyUpdatedTask = $offlineData.updatedWhileOfflineTasksArray.findIndex(task => task._id === _id);
            if(indexOfPreviouslyUpdatedTask === -1) {
                const newUpdatedTask = {
                    "_id": _id,
                    "content": newContent,
                    "last_updated": last_updated
                }
                $offlineData.updatedWhileOfflineTasksArray = [...$offlineData.updatedWhileOfflineTasksArray, newUpdatedTask];
            }
            else {
                $offlineData.updatedWhileOfflineTasksArray[indexOfPreviouslyUpdatedTask].content = newContent;
                $offlineData.updatedWhileOfflineTasksArray[indexOfPreviouslyUpdatedTask].last_updated = last_updated;
            }
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id={_id} class="task" class:important class:completed transition:fade={{duration: 300}}>
    <button on:click={openDrawer}><img src={menuIconSrc} alt="menu"></button>
    <div>
        <p on:keydown={e => handleInput(e)} on:blur={e => blurHandler(e)} class="content" bind:textContent={content} contenteditable></p>
        <p class="date">{getFormattedLocalTime(date)}</p>
    </div>
    <button on:click={toggleCompleted} class="completed-toggle"><img src={completed ? checkedRadioSrc : uncheckedRadioSrc} alt="complete"></button>
</div>

<style>
    .task {
        border: 2px solid transparent;
        border-radius: .5rem;
        background-color: var(--clr-primary-light);
        padding: .5rem;
        display: flex;
        gap: .5rem;
        align-items: center;

        /* animation: task-fade-in 200ms ease-in-out; */
    }

    .content {
        max-width: 65vw;
    }

    .date {
        color: #757575;
    }

    .task.important {
        border-color: var(--clr-accent);
    }

    /* .task.completed {
        border-color: var(--clr-green);
    } */

    .task.completed .content {
        text-decoration: line-through;
    }

    .completed-toggle {
        margin-left: auto;
    }

    /* @keyframes task-fade-in {
        from {opacity: 0;}
        to {opacity: 1;}
    } */
</style>
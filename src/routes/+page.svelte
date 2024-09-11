<script>
    import Task from "$lib/Task.svelte";
    import Drawer from "$lib/Drawer.svelte";
    import { isSettingsActive } from "$lib/stores";
    import { tasks } from "$lib/stores";
    import { accountInformation } from "$lib/stores";
    import { appearanceData } from "$lib/stores";
    import settingsIconSrc from "$lib/assets/settings-icon.svg";
    import allTasksIconSrc from "$lib/assets/all-tasks-icon.svg";
    import syncIconSrc from "$lib/assets/sync-icon.svg";
	import Settings from "../lib/Settings.svelte";
    import { token } from "$lib/stores";
    import { page } from '$app/stores';
    import { isClientOnline } from '$lib/stores';
    import { offlineData } from '$lib/stores';

    $: {
        if($isClientOnline) {sync()}
    };

    let syncing = false;

    const sync = () => {
        const addArray = $tasks.filter(task => task._id.includes("-fake-id"));
        const updateArray = $offlineData.updatedWhileOfflineTasksArray.filter(task => !$offlineData.deletedWhileOfflineIDS.includes(task._id) && !task._id.includes("-fake-id"));
        const deleteArray = $offlineData.deletedWhileOfflineIDS.filter(taskID => !taskID.includes("-fake-id"));
        
        if(addArray.length || updateArray.length || deleteArray.length) {
            syncing = true;
            addArray.forEach(task => {
                delete task.UserId;
                delete task.__v;
                delete task.last_updated;
            });
            fetch("https://task-manager-back-end-7gbe.onrender.com/api/offline", {
                method: "POST",
                body: JSON.stringify({
                token: $token,
                addArray: addArray,
                updateArray: updateArray,
                deleteArray: deleteArray
                }),
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(res => res.json())
            .then(json => {

                $offlineData.updatedWhileOfflineTasksArray = [];
                $offlineData.deletedWhileOfflineIDS = [];

                if(json.data) {

                    const idPairsArray = json.data.idPairs;
                    idPairsArray.forEach(pair => {
                        const fakeTaskIndex = $tasks.findIndex(task => task._id === pair.fakeID);
                        $tasks[fakeTaskIndex]._id = pair.realID;
                    })
                }

                syncing = false;
            })
            .catch(err => console.log(err));
        }
    }
    
    const getUserInfo = (jsonData) => {
        $accountInformation.username = jsonData.name;
        $accountInformation.email = jsonData.email;
        $accountInformation.appearanceCode = jsonData.appearance
        $accountInformation.auto_delete = jsonData.auto_delete
    }

    const getTasksFromServer = async () => {
        const res = await fetch("https://task-manager-back-end-7gbe.onrender.com/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                token: $token
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });
        const json = await res.json();

        getUserInfo(json.data);

        $tasks = json.data.tasks;
    }

    const addTask = (content) => {
        const date = new Date().getTime();
        if($isClientOnline) {
            fetch("https://task-manager-back-end-7gbe.onrender.com/api/tasks/add", {
                method: "POST",
                body: JSON.stringify({
                token: $token,
                content: content,
                date: date,
                important: filterCode === 2 ? true : false,
                completed: filterCode === 3 ? true : false
                }),
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(res => res.json())
            .then(json => {
                const newTask = {
                    _id: json.data.id,
                    content: content,
                    date: date,
                    last_updated: date,
                    completed: filterCode === 3 ? true : false,
                    important: filterCode === 2 ? true : false
                }

                $tasks = [...$tasks, newTask];
            })
        }

        else {
            const newTask = {
                _id: generateFakeID(),
                content: content,
                date: date,
                last_updated: date,
                completed: filterCode === 3 ? true : false,
                important: filterCode === 2 ? true : false
            }

            $tasks = [...$tasks, newTask];
        }
    }

    let filterCode = 1;
    $: undoneTasks = $tasks.filter(task => !task.completed);
    $: importantTasks = $tasks.filter(task => !task.completed && task.important);
    $: completedTasks = $tasks.filter(task => task.completed);
    
    const getTokenFromPageURL = () => {
        const token = $page.url.href.split('=')[1];
        return token;
    }

    const handleTokenAssignment = () => {
        $token = getTokenFromPageURL();
    }

    handleTokenAssignment();

    const generateFakeID = () => {
        let fakeID;
        do {
            fakeID = Math.floor(100000 + Math.random() * 900000);
        } while ($tasks.map(task => task._id).includes(fakeID));
        return fakeID + "-fake-id";
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<svelte:window bind:online={$isClientOnline}/>
<div style={`--clr-accent: ${$appearanceData[$accountInformation.appearanceCode - 1].hex}`}>
    <div class="controls">
        <div class="navbar">
            <button on:click={() => $isSettingsActive = true} class="settings"><img src={settingsIconSrc} alt="settings"></button>
            <p>
                {#if $accountInformation.username}
                    {$accountInformation.username.split(" ")[0]}'s Tasks
                {:else}
                    Loading...
                {/if}
            </p>
            <p class="version">v 1.9.23</p>
            <div class="filters">
                <button on:click={() => filterCode = 0} class="all-filter" class:active={filterCode === 0}>
                    <img src={allTasksIconSrc} alt="all tasks">
                </button>
                <button on:click={() => filterCode = 1} class="undone-filter circle" class:active={filterCode === 1}></button>
                <button on:click={() => filterCode = 2} class="important-filter circle" class:active={filterCode === 2}></button>
                <button on:click={() => filterCode = 3} class="completed-filter circle" class:active={filterCode === 3}></button>
            </div>
        </div>
        <input on:change={e => {
                addTask(e.target.value);
                e.target.value = "";
            }} class="task-input" placeholder="Enter a task..." type="text">
    </div>
    
    <div class="task-container">
        {#await getTasksFromServer()}
            <span class="loader"></span>
        {:then}
            {#if filterCode === 0}
                {#each $tasks as { _id, content, date, last_updated, important, completed } (_id)}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    <p>No tasks.</p>
                {/each}
            {:else if  filterCode === 1}
                {#each undoneTasks as { _id, content, date, last_updated, important, completed } (_id)}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    <p>No tasks.</p>
                {/each}
            {:else if filterCode === 2}
                {#each importantTasks as { _id, content, date, last_updated, important, completed } (_id)}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    <p>No tasks.</p>
                {/each}
            {:else}
                {#each completedTasks as { _id, content, date, last_updated, important, completed } (_id)}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    <p>No tasks.</p>
                {/each}
            {/if}
        {/await}
    </div>
    
    <Drawer />
    <Settings />
    
    <!-- <p style="padding-inline: 1rem;"></p> -->
    <!-- <button style="padding-inline: 1rem;" on:click={() => $isClientOnline = !$isClientOnline}>{$isClientOnline ? "Online" : "Offline"}</button> -->

    <div class="online-status" class:online={$isClientOnline}>
        {#if $isClientOnline}
            {#if syncing}
                <img src={syncIconSrc} alt="syncing icon">
                Syncing
            {:else}
                <div class="circle"></div>
                Online
            {/if}
        {:else}
            <div class="circle"></div>
            Offline
        {/if}
    </div>
</div>

<style>
    .task-container {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding-inline: .5rem;
    }

    .task-container > p {
        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
    }

    .navbar {
        display: flex;
        gap: .5rem;
        align-items: center;
    }

    .controls {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        background-color: black;
        padding: .5rem;
    }

    .task-input {
        width: 100%;
        padding-inline: .5rem .3rem;
        background-color: var(--clr-primary-light);
        border-radius: .5rem;
        margin-block-start: .5rem;
        color: white;
        border: none;
    }

    .filters {
        display: flex;
        align-items: center;
        gap: .5rem;
        margin-left: auto;
    }

    .filters > * {
        border: 2px solid transparent;
    }

    .filters > *.active {
        border-color: white;
    }

    .all-filter img {
        width: 25px;
    }

    .undone-filter {
        background-color: var(--clr-primary-light);
    }

    .important-filter {
        background-color: var(--clr-accent);
    }

    .completed-filter {
        background-color: var(--clr-green);
    }

    .online-status {
        display: flex;
        gap: .5rem;
        align-items: center;
        position: fixed;
        left: .5rem;
        bottom: .5rem;
        background-color: var(--clr-primary-light);
        padding: .5rem;
        border-radius: .5rem;
    }

    .online-status .circle {
        background-color: var(--clr-red);
    }

    .online-status.online .circle {
        background-color: var(--clr-green);
    }

    .online-status img {
        animation: rotate 500ms infinite linear;
        width: 25px;
    }

    @keyframes rotate {
        from {
            rotate: 0deg;
        }

        to {
            rotate: -360deg;
        }
    }

    .version {
        color: var(--clr-text-gray);
        font-size: 1rem;
    }

    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: var(--clr-primary-light);
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: loader-rotation 600ms linear infinite;

        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
    }

    @keyframes loader-rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
</style>
<script>
    import Task from "$lib/Task.svelte";
    import Drawer from "$lib/Drawer.svelte";
    import { isSettingsActive } from "$lib/stores";
    import { tasks } from "$lib/stores";
    import { accountInformation } from "$lib/stores";
    import { appearanceData } from "$lib/stores";
    import settingsIconSrc from "$lib/assets/settings-icon.svg";
    import allTasksIconSrc from "$lib/assets/all-tasks-icon.svg";
	import Settings from "../lib/Settings.svelte";
    import { token } from "$lib/stores";
    import { page } from '$app/stores';
    
    const getUserInfo = (jsonData) => {
        $accountInformation.username = jsonData.name;
        $accountInformation.email = jsonData.email;
        $accountInformation.appearanceCode = jsonData.appearance
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
        fetch("https://task-manager-back-end-7gbe.onrender.com/api/tasks/add", {
            method: "POST",
            body: JSON.stringify({
            token: $token,
            content: content,
            date: date,
            important: false,
            completed: false
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
                completed: false,
                important: false
            }

            $tasks = [...$tasks, newTask];
        })
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
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

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
            Loading...
        {:then}
            {#if filterCode === 0}
                {#each $tasks as { _id, content, date, last_updated, important, completed }}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    No tasks
                {/each}
            {:else if  filterCode === 1}
                {#each undoneTasks as { _id, content, date, last_updated, important, completed }}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    No tasks
                {/each}
            {:else if filterCode === 2}
                {#each importantTasks as { _id, content, date, last_updated, important, completed }}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    No tasks
                {/each}
            {:else}
                {#each completedTasks as { _id, content, date, last_updated, important, completed }}
                    <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
                    {:else}
                    No tasks
                {/each}
            {/if}
        {/await}
    </div>
    
    <Drawer />
    <Settings />
    
    <p style="padding-inline: 1rem;">v 1.6.12</p>
</div>

<style>
    .task-container {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding-inline: .5rem;
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
</style>
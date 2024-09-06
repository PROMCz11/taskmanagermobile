<script>
    import Task from "$lib/Task.svelte";
    import Drawer from "$lib/Drawer.svelte";
    // import { isDrawerActive } from "$lib/stores";
    import { tasks } from "$lib/stores";
    import settingsIconSrc from "$lib/assets/settings-icon.svg";
    import allTasksIconSrc from "$lib/assets/all-tasks-icon.svg";

    // $: console.log($tasks);

    const getTasksFromServer = async () => {
        const res = await fetch("https://task-manager-back-end-7gbe.onrender.com/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmQwOWJkY2Q2MDIyYTZhOTc5OTY4YWYiLCJpYXQiOjE3MjQ5NjQ4NTMsImV4cCI6NDMxNjk2NDg1M30.0HquznnuvoYXtpZrtBsnpdCBZvPqcWpzS_vBTZx3v_Q"
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });
        const json = await res.json();
        $tasks = json.data.tasks;
    }

    const addTask = (content) => {
        const date = new Date().getTime();
        fetch("https://task-manager-back-end-7gbe.onrender.com/api/tasks/add", {
            method: "POST",
            body: JSON.stringify({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmQwOWJkY2Q2MDIyYTZhOTc5OTY4YWYiLCJpYXQiOjE3MjQ5NjQ4NTMsImV4cCI6NDMxNjk2NDg1M30.0HquznnuvoYXtpZrtBsnpdCBZvPqcWpzS_vBTZx3v_Q",
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

    $: undoneTasks = $tasks.filter(task => !task.completed).map(task => task);

    $: importantTasks = $tasks.filter(task => !task.completed && task.important).map(task => task);

    $: completedTasks = $tasks.filter(task => task.completed).map(task => task);

    // const filterTasks = () => {
    //     // Code 0: all tasks
    //     // Code 1: undone tasks
    //     // Code 2: important tasks
    //     // Code 3: completed tasks

    //     // console.log("Filtered");

    //     switch (filterCode) {
    //         case 0:
    //             return $tasks;
    //         case 1:
    //             return $tasks.filter(task => !task.completed).map(task => task);
    //         case 2:
    //             return $tasks.filter(task => !task.completed && task.important).map(task => task);
    //         case 3:
    //             return $tasks.filter(task => task.completed).map(task => task);
        
    //         default:
    //             break;
    //     }
    // }

    // $: filterTasks(filterCode);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<div class="controls">
    <div class="navbar">
        <button class="settings"><img src={settingsIconSrc} alt="settings"></button>
        <p>Zain's Tasks</p>
        <div class="filters">
            <button on:click={() => filterCode = 0} class="all-filter">
                <img src={allTasksIconSrc} alt="all tasks">
            </button>
            <button on:click={() => filterCode = 1} class="undone-filter active circle"></button>
            <button on:click={() => filterCode = 2} class="important-filter circle"></button>
            <button on:click={() => filterCode = 3} class="completed-filter circle"></button>
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
            {/each}
        {:else if  filterCode === 1}
            {#each undoneTasks as { _id, content, date, last_updated, important, completed }}
                <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
            {/each}
        {:else if filterCode === 2}
            {#each importantTasks as { _id, content, date, last_updated, important, completed }}
                <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
            {/each}
        {:else}
            {#each completedTasks as { _id, content, date, last_updated, important, completed }}
                <Task bind:_id bind:content bind:date bind:last_updated bind:important bind:completed />
            {/each}
        {/if}
    {/await}
</div>

<Drawer />

<p style="padding-inline: 1rem;">v 1.2.7</p>

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
        background-color: #222222;
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
        background-color: #222222;
    }

    .important-filter {
        background-color: red;
    }

    .completed-filter {
        background-color: green;
    }
</style>
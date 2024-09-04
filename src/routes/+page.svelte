<script>
    import Task from "$lib/Task.svelte";
    import Drawer from "$lib/Drawer.svelte";
    // import { isDrawerActive } from "$lib/stores";
    import settingsIconSrc from "$lib/assets/settings-icon.svg";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<div class="navbar">
    <button class="settings"><img src={settingsIconSrc} alt="settings"></button>
    <div>
        filters
    </div>
</div>

<div class="task-container">
    <Task />
    <Task />
    <Task important={true}/>
    <Task />
</div>

<Drawer />

<p style="padding-inline: 1rem;">v 1.0.8</p>

<style>
    .task-container {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .5rem;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .5rem;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        background-color: black;
    }
</style>
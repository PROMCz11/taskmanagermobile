<script>
    import Task from "$lib/Task.svelte";
    import Drawer from "$lib/Drawer.svelte";
    import { isDrawerActive } from "$lib/stores";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div>
    <Task />
    <Task />
    <Task important={true}/>
    <Task />
</div>

<Drawer />

<div style="padding: 1rem;" class="to-be-deleted">
    <!-- <p>TO DO</p> -->
    
    <p>v 1.0.5</p>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .5rem;
    }
</style>
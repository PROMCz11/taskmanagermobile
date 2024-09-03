<script>
    import Task from "$lib/Task.svelte";
    import Drawer from "$lib/Drawer.svelte";
    import { drawerActive } from "$lib/stores";

    // To be deleted
</script>

<div on:click={e => {
    const target = e.target;
    if(!target.classList.contains("task") && !target.parentElement.classList.contains("task") && !target.parentElement.parentElement.classList.contains("task")) {
        $drawerActive = false;
    }
}}>
    <div>
        <Task />
        <Task />
        <Task important={true}/>
        <Task />
    </div>
    
    <Drawer />
    
    <div style="padding: 1rem;" class="to-be-deleted">
        <p>TO DO: learn a UI library for swipe gestures and implement swiping to navigate between task categories</p>
        
        <p>v 1.0.2</p>
    </div>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .5rem;
    }
</style>
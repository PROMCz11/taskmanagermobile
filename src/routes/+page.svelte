<script>
    import Task from "$lib/Task.svelte";
    import Drawer from "$lib/Drawer.svelte";
    import { isDrawerActive } from "$lib/stores";
</script>

<div on:click={e => {
    if(!e.target.classList.contains("drawer") && !e.target.parentElement.classList.contains("drawer") && $isDrawerActive) {
        $isDrawerActive = false;
        console.log("false");
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
        
        <p>v 1.0.3</p>
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
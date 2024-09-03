<script>
    import Task from "$lib/Task.svelte";
</script>

<div>
    <Task />
    <Task />
    <Task important={true}/>
    <Task />
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .5rem;
    }
</style>

<div style="padding: 1rem;" class="to-be-deleted">
    <p>note: upon clicking a task, a swipe up panel appears from the bottom of the screen, containing details such as important and completed status, id, last updated, and the delete button</p>
    
    <p>v 1.0.0</p>
</div>
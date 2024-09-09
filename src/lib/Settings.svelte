<script>
    import { isSettingsActive } from "$lib/stores";
    import logoSrc from "$lib/assets/logo.svg";
    import deleteAllSrc from "$lib/assets/delete-all-icon.svg";
    import deleteCompletedSrc from "$lib/assets/delete-completed-icon.svg";
    import deleteAccountSrc from "$lib/assets/delete-account-icon.svg";
    import exitIconSrc from "$lib/assets/exit-icon.svg";
    import { accountInformation } from "$lib/stores";
    import { appearanceData } from "$lib/stores";
    import { token } from "$lib/stores";
    import { tasks } from "$lib/stores";

    let isDeleteAccountModalActive = false;

    const updateUsername = (newName) => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                token: $token,
                name: newName
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    const updateEmail = (newEmail) => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                token: $token,
                email: newEmail
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    const updatePassword = (newPassword) => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                token: $token,
                password: newPassword
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    const updateAppearance = code => {
        $accountInformation.appearanceCode = code
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                token: $token,
                appearance: code
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    const deleteAllTasks = () => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/delete`, {
            method: "DELETE",
            body: JSON.stringify({
            token: $token,
            ids: $tasks.map(task => task._id)
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })

        $tasks = [];
    }

    const deleteCompletedTasks = () => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/delete`, {
            method: "DELETE",
            body: JSON.stringify({
            token: $token,
            ids: $tasks.filter(task => task.completed).map(task => task._id)
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })

        $tasks = $tasks.filter(task => !task.completed);
    }

    const toggleAutoDelete = () => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                token: $token,
                auto_delete: $accountInformation.auto_delete ? 0 : 1
                // auto_delete: !$accountInformation.auto_delete
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
        // .then(res => res.json())
        // .then(json => console.log(json))
        // .catch(err => console.log(err))

        $accountInformation.auto_delete = $accountInformation.auto_delete ? 0 : 1;
    }

    const deleteAccount = (password) => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/delete`, {
            method: "DELETE",
            body: JSON.stringify({
                token: $token,
                password: password
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(res => res.json())
        .then(json => {
            if(json.status) {
                window.location.href = "https://task-manager-experiment-with-backend.pages.dev/log-in";
            }
        })
    }
</script>

<div class="settings-container" class:active={$isSettingsActive}>
    <div class="top">
        <button class="logo" on:click={() => window.location.href = "https://task-manager-experiment-with-backend.pages.dev/"}>
            <img src={logoSrc} alt="task manager logo">
            <p>Task Manager</p>
        </button>
        <button on:click={() => $isSettingsActive = false}><img src={exitIconSrc} alt="exit"></button>
    </div>
    <div class="settings">
        <div class="setting-group">
            <p class="title">Account settings</p>
            <p>User name </p>
            <input on:change={e => updateUsername(e.target.value)} type="text" placeholder={$accountInformation.username}>
            <p>Email </p>
            <input on:change={e => updateEmail(e.target.value)} type="text" placeholder={$accountInformation.email}>
            <p>Password </p>
            <input on:change={e => updatePassword(e.target.value)} type="text" placeholder="Set a new password...">
            <!-- on any input change we show a save btn -->
        </div>
        <div class="setting-group">
            <p class="title">Appearance</p>
            <div class="appearance-grid">
                {#each $appearanceData as { code, hex }}
                    <button style="background-color: {hex}" class="circle" on:click={() => updateAppearance(code)} class:active={$accountInformation.appearanceCode === code}></button>
                {/each}
            </div>
            <p>Selected: {$appearanceData[$accountInformation.appearanceCode - 1].name}</p>
        </div>
        <div class="setting-group">
            <button on:click={deleteAllTasks}>
                <img src={deleteAllSrc} alt="delete all tasks">
                <p>Delete all tasks</p>
            </button>
            <button on:click={deleteCompletedTasks}>
                <img src={deleteCompletedSrc} alt="delete completed tasks">
                <p>Delete completed tasks</p>
            </button>
        </div>
        <div class="setting-group">
            <label for="auto-delete">
                <input type="checkbox" name="" id="auto-delete" on:change={toggleAutoDelete} checked={$accountInformation.auto_delete ? true : false}>
                Auto delete completed tasks
            </label>
        </div>
        <div class="setting-group" style="position: relative;">
            {#if isDeleteAccountModalActive}
                <div>
                    <input type="text" placeholder="Enter password to confirm" on:keydown={e => {
                        if(e.key === "Enter") {
                            deleteAccount(e.target.value);
                        }
                    }}>
                    <button on:click={() => isDeleteAccountModalActive = false}>Cancel</button>
                </div>
            {:else}
                <button on:click={() => isDeleteAccountModalActive = true}>
                    <img src={deleteAccountSrc} alt="delete account">
                    <p>Delete account</p>
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    .settings-container {
        position: fixed;
        inset: 0;
        background-color: black;

        transition: translate 150ms ease-in-out;
        translate: -100% 0;
        /* translate: 0; */

        padding: .5rem;

        overflow: auto;
    }

    .settings-container.active {
        translate: 0;
    }
    
    /* .settings {
        overflow: auto;
        max-height: 100vh;
        max-height: 100svh;
        max-height: 90svh;
    } */

    .top {
        display: flex;
        gap: .5rem;
        justify-content: space-between;
        align-items: center;
        padding-bottom: .5rem;
    }

    .top img {
        width: 40px;
    }

    .logo {
        display: flex;
        gap: .5rem;
        align-items: center;
    }

    .logo p {
        font-size: 1.6rem;
    }

    input:not([type="checkbox"]) {
        background-color: transparent;
        border: 0;
        color: white;
        width: 100%;
    }

    .title {
        font-size: 1.4rem;
    }

    .appearance-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem;
        width: max-content;
    }

    .appearance-grid .circle {
        width: 40px;
        height: 40px;
    }

    .appearance-grid .circle.active {
        border: 3px solid white;
    }

    .setting-group {
        margin-block: 1.5rem;
    }

    .setting-group > button {
            display: flex;
            align-items: center;
            gap: .5rem;
            color: var(--clr-red);
        }
</style>
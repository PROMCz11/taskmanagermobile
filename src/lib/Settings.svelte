<script>
    import { isSettingsActive } from "$lib/stores";
    import logoSrc from "$lib/assets/logo.svg";
    import deleteAllSrc from "$lib/assets/delete-all-icon.svg";
    import deleteCompletedSrc from "$lib/assets/delete-completed-icon.svg";
    import deleteAccountSrc from "$lib/assets/delete-account-icon.svg";
    import exitIconSrc from "$lib/assets/exit-icon.svg";
    import logoutIconSrc from "$lib/assets/logout-icon.svg";
    import { accountInformation } from "$lib/stores";
    import { appearanceData } from "$lib/stores";
    import { token } from "$lib/stores";
    import { tasks } from "$lib/stores";
    import { isClientOnline } from "$lib/stores";

    let isDeleteAccountModalActive = false;

    const updateUsername = (newName) => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                // token: $token,
                name: newName
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
            }
        })
    }

    const updateEmail = (newEmail) => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                // token: $token,
                email: newEmail
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
            }
        })
    }

    const updatePassword = (newPassword) => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                // token: $token,
                password: newPassword
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
            }
        })
    }

    const updateAppearance = code => {
        $accountInformation.appearanceCode = code
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                // token: $token,
                appearance: code
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
            }
        })
    }

    const deleteAllTasks = () => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/delete`, {
            method: "DELETE",
            body: JSON.stringify({
            // token: $token,
            ids: $tasks.map(task => task._id)
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
            }
        })

        $tasks = [];
    }

    const deleteCompletedTasks = () => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/tasks/delete`, {
            method: "DELETE",
            body: JSON.stringify({
            // token: $token,
            ids: $tasks.filter(task => task.completed).map(task => task._id)
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
            }
        })

        $tasks = $tasks.filter(task => !task.completed);
    }

    const toggleAutoDelete = () => {
        fetch(`https://task-manager-back-end-7gbe.onrender.com/api/user/update`, {
            method: "PATCH",
            body: JSON.stringify({
                // token: $token,
                auto_delete: $accountInformation.auto_delete ? 0 : 1
                // auto_delete: !$accountInformation.auto_delete
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
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
                // token: $token,
                password: password
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${$token}`
            }
        })
        .then(res => res.json())
        .then(json => {
            if(json.status) {
                logout();
            }
        })
    }

    const logout = () => {
        window.location.href = "https://task-manager-by-vision.pages.dev/login";
    }
</script>

<div class="settings-container" class:active={$isSettingsActive}>
    <div class="top">
        <button class="logo" on:click={() => window.location.href = "https://task-manager-by-vision.pages.dev/"}>
            <img src={logoSrc} alt="task manager logo">
            <p>Task Manager</p>
        </button>
        <button on:click={() => $isSettingsActive = false}><img src={exitIconSrc} alt="exit"></button>
    </div>
    <div class="settings">
        {#if !$isClientOnline}
            <div class="settings-disabled">Disabled in Offline Mode</div>
        {/if}
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
        <div class="setting-group">
            {#if isDeleteAccountModalActive}
                <div>
                    <input type="password" placeholder="Enter password to confirm" on:keydown={e => {
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
        <div class="setting-group">
            <button on:click={logout}>
                <img src={logoutIconSrc} alt="log out icon">
                <p>Logout</p>
            </button>
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

        padding: .5rem;

        overflow: auto;

        z-index: 2;
    }

    .settings-container.active {
        translate: 0;
    }
    
    .settings {
        position: relative;
    }

    .settings-disabled {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, .8);
        display: grid;
        place-content: center;
    }

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
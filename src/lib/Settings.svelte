<script>
    import { isSettingsActive } from "$lib/stores";
    import logoSrc from "$lib/assets/logo.svg";
    import exitIconSrc from "$lib/assets/exit-icon.svg";
    import { accountInformation } from "$lib/stores";
    import { appearanceData } from "$lib/stores";
    import { token } from "$lib/stores";

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
                    <button style="background-color: {hex}" class="circle" on:click={() => $accountInformation.appearanceCode = code} class:active={$accountInformation.appearanceCode === code}></button>
                {/each}
            </div>
            <p>Selected: {$appearanceData[$accountInformation.appearanceCode - 1].name}</p>
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
    }

    .settings-container.active {
        translate: 0;
    }

    .top {
        display: flex;
        gap: .5rem;
        justify-content: space-between;
        align-items: center;
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

    input {
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
</style>
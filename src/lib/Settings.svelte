<script>
    import { isSettingsActive } from "$lib/stores";
    import logoSrc from "$lib/assets/logo.svg";
    import exitIconSrc from "$lib/assets/exit-icon.svg";
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
        <div class="setting">
            <p>Account settings</p>
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
</style>
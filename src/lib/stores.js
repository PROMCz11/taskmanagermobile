import { writable } from "svelte/store";

export let isDrawerActive = writable(false);

export let IDForDrawer = writable("");

export let tasks = writable([]);

export let isSettingsActive = writable(false);

export let accountInformation = writable({
    username: "",
    email: "",
    // There're more to come (the apperance and autoComplete codes)
});
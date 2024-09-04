import { writable } from "svelte/store";

export let isDrawerActive = writable(false);

export let IDForDrawer = writable("");

export let tasks = writable([]);
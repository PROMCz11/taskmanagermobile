import { writable } from "svelte/store";

export let isDrawerActive = writable(false);

export let tasks = writable([]);
import { writable } from "svelte/store";

export let isDrawerActive = writable(false);

export let IDForDrawer = writable("");

export let tasks = writable([]);

export let isSettingsActive = writable(false);

export let accountInformation = writable({
    username: "",
    email: "",
    appearanceCode: 1,
    // There're more to come (the apperance and autoComplete codes)
});

export let appearanceData = writable([
    {name: "Amber", code: 1, hex: "#FFC107"},
    {name: "Light Blue", code: 2, hex: "#01FFF4"},
    {name: "Purple", code: 3, hex: "#8338EC"},
    {name: "Pink", code: 4, hex: "#FF1178"},
    {name: "Orange", code: 5, hex: "#FB5607"},
    {name: "Blue", code: 6, hex: "#3A86FF"},
    {name: "Scarlet", code: 7, hex: "#A0153E"},
    {name: "Grape", code: 8, hex: "#5D0E41"},
    {name: "Baby Pink", code: 9, hex: "#FCB1B1"},
    {name: "Silver", code: 10, hex: "#D4D5D9"},
])
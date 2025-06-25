import { persisted } from 'svelte-persisted-store'

export const user = persisted('user', {
    avatar: undefined,
    collectionId: undefined,
    collectionName: undefined,
    created: undefined,
    email: undefined,
    emailVisibility: undefined,
    id: undefined,
    name: undefined,
    updated: undefined,
    username: undefined,
    verified: undefined,
    theme_color_hue: 200,
})
import { writable } from 'svelte/store';

export const user = writable({
  email: '',
  role: '' // 'user' or 'admin'
});

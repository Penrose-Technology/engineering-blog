import { writable } from 'svelte/store';

export let showTitle = writable<string>('');
export let env = writable<{
	isIOS: boolean;
	isAndroid: boolean;
	isMobile: boolean;
	isIPhone: boolean;
}>({
	isIOS: false,
	isAndroid: false,
	isIPhone: false,
	isMobile: false
});

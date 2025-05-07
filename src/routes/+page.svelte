<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';

	let username = $state('');
	let password = $state('');

	const btnclick = async () => {
		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					password: password
				})
			});

			if (response.ok) {
				const result = await response.json();
				// Du kan her gemme brugerdata/token hvis nødvendigt
				goto('/home');
			} else {
				alert('Login mislykkedes – forkert brugernavn eller adgangskode');
			}
		} catch (error) {
			console.error('Login-fejl:', error);
			alert('Der opstod en fejl ved loginforsøget');
		}
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-blue-900 p-4">
	<div class="mx-auto w-full max-w-md bg-white rounded-lg shadow-lg p-6">
		<h1 class="text-4xl font-bold text-center text-blue-900 mb-4">Pausepunktet</h1>
		<h2 class="text-2xl font-semibold text-center text-blue-700 mb-6">Log ind</h2>

		<div class="mb-4">
			<Input class="input w-full" bind:value={username} placeholder="Brugernavn" />
		</div>

		<div class="mb-4">
			<Input class="input w-full" type="password" bind:value={password} placeholder="Adgangskode" />
		</div>

		<div class="mb-6 text-center">
			<Button class="btn btn-primary w-full" onclick={btnclick}>Login</Button>
		</div>

		<p class="text-center text-blue-800">
			Har du ikke en bruger?
			<a href="/admin" class="ml-1 underline text-blue-600 hover:text-blue-800">Opret en her</a>
		</p>
	</div>
</div>


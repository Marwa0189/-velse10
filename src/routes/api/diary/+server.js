import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { diaryEntry } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm'; // 👈 VIGTIGT!

/**
 * Save diary entry for the logged-in user
 */
export async function POST({ request, locals }) {
	try {
		const { note, stress } = await request.json();

		const userId = locals.user?.id;
		if (!userId) return json({ error: 'Bruger ikke logget ind' }, { status: 401 });
		if (!note || typeof stress !== 'number') return json({ error: 'Ugyldige data' }, { status: 400 });

		await db.insert(diaryEntry).values({ note, stressLevel: stress, userId });

		return json({ success: true });
	} catch (err) {
		console.error('Fejl ved gemning:', err);
		return json({ error: 'Serverfejl' }, { status: 500 });
	}
}

/**
 * Fetch diary entries for the logged-in user
 */
export async function GET({ locals }) {
	if (!locals.user) {
		return new Response(JSON.stringify({ error: 'Ikke logget ind' }), { status: 401 });
	}

	const entries = await db
		.select()
		.from(diaryEntry)
		.where(eq(diaryEntry.userId, locals.user.id))
		.orderBy(diaryEntry.createdAt);

	return new Response(JSON.stringify(entries), { status: 200 });
}

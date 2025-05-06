import { db } from './lib/server/db/index.js';
import { user as userTable } from './lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
	const userId = event.cookies.get('userid');
	console.log('🧁 Cookie userid:', userId);

	const idNumber = Number(userId);

	if (!userId || isNaN(idNumber)) {
		console.log('❌ Ingen gyldig bruger-id i cookie');
		return await resolve(event);
	}

	try {
		const [user] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.id, idNumber));

		if (user) {
			console.log('✅ Bruger fundet i database:', user);
			event.locals.user = user;
		} else {
			console.log('⚠️ Bruger ikke fundet i database med id:', idNumber);
		}
	} catch (err) {
		console.error('💥 Fejl ved databaseopslag:', err);
	}

	return await resolve(event);
}

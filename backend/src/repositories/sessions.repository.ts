import { desc, eq } from 'drizzle-orm';

import { CreateSessionDTO, UpdateSessionDTO } from '@/types/sessions.types.js';
import { db } from '@/db/client.js';
import { farmSessions, sessionDrops, sessionSkins } from '@/db/schema.js';

export async function upsertSession(data: CreateSessionDTO) {
  return await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(farmSessions)
      .values({
        dateFrom: data.date_from,
        dateTo: data.date_to,
        accountsCount: data.accounts_count,
        totalValue: String(data.total_value),
        totalCases: data.total_cases,
        avgCasePrice: String(data.avg_case_price),
        avgDropPrice: String(data.avg_drop_price),
        isFinal: data.is_final ?? false,
        notes: data.notes ?? null,
      })
      .onConflictDoUpdate({
        target: [farmSessions.dateFrom, farmSessions.dateTo],
        set: {
          accountsCount: data.accounts_count,
          totalValue: String(data.total_value),
          totalCases: data.total_cases,
          avgCasePrice: String(data.avg_case_price),
          avgDropPrice: String(data.avg_drop_price),
          isFinal: data.is_final ?? false,
          notes: data.notes ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();

    await tx.delete(sessionDrops).where(eq(sessionDrops.farmSessionId, session.id));
    await tx.delete(sessionSkins).where(eq(sessionSkins.farmSessionId, session.id));

    await tx.insert(sessionDrops).values(
      data.drops.map((drop) => ({
        farmSessionId: session.id,
        caseName: drop.case_name,
        amount: drop.amount,
        percentage: String(drop.percentage),
      }))
    );

    if (data.skins && data.skins.length > 0) {
      await tx.insert(sessionSkins).values(
        data.skins.map((skin) => ({
          farmSessionId: session.id,
          skinName: skin.skin_name,
          amount: skin.amount,
          price: String(skin.price),
        }))
      );
    }

    return session;
  });
}

export async function getAllSessions() {
  return await db.select().from(farmSessions).orderBy(desc(farmSessions.dateFrom));
}

export async function getSessionById(id: number) {
  const session = await db.select().from(farmSessions).where(eq(farmSessions.id, id));

  if (session.length === 0) {
    return null;
  }

  const drops = await db.select().from(sessionDrops).where(eq(sessionDrops.farmSessionId, id));
  const skins = await db.select().from(sessionSkins).where(eq(sessionSkins.farmSessionId, id));

  return {
    ...session[0],
    drops,
    skins,
  };
}

export async function deleteSession(id: number) {
  const [deletedSession] = await db.delete(farmSessions).where(eq(farmSessions.id, id)).returning();
  return deletedSession ?? null;
}

export async function updateSession(id: number, data: UpdateSessionDTO) {
  const values = {
    accountsCount: data.accounts_count,
    totalValue: data.total_value != null ? String(data.total_value) : undefined,
    totalCases: data.total_cases,
    avgCasePrice: data.avg_case_price != null ? String(data.avg_case_price) : undefined,
    avgDropPrice: data.avg_drop_price != null ? String(data.avg_drop_price) : undefined,
    isFinal: data.is_final,
    notes: data.notes,
    updatedAt: new Date(),
  };

  const set = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined));

  const [updated] = await db
    .update(farmSessions)
    .set(set)
    .where(eq(farmSessions.id, id))
    .returning();

  return updated ?? null;
}

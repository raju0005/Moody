"use server";

import { getMoodById, MOODS } from "@/app/lib/mood";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getPixaBayImage } from "./public";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";

export async function createJournalEntry(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Un authorized");
    const req = await request();
    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE LIMIT EXECEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Too many requests Please try again later");
      }
      throw new Error("Request Blocked.");
    }
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid Mood");

    const entry = await db.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        userId: user.id,
        collectionId: data.collectionId || null,
      },
    });

    await db.draft.deleteMany({
      where: {
        userId: user.id,
      },
    });
    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getJournalEntries({
  collectionId,
  orderBy = "desc",
} = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Un authorized");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User not Found");
    const entries = await db.entry.findMany({
      where: {
        userId: user.id,
        ...(collectionId === "unorganized"
          ? { collectionId: null }
          : collectionId
          ? { collectionId }
          : {}),
      },
      include: {
        Collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
    });

    const entriesWithMoodData = entries.map((entry) => ({
      ...entry,
      moodData: getMoodById(entry.mood),
    }));
    return {
      success: true,
      data: {
        entries: entriesWithMoodData,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function getJournalEntry(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Un authorized");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User not Found");
    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        Collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!entry) throw new Error("Entry Not Found");
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function deleteEntry(entryId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Un authorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    const entry = await db.entry.findFirst({
      where: {
        userId: user.id,
        id: entryId,
      },
    });
    if (!entry) throw new Error("Entry Not Found");
    await db.entry.delete({
      where: {
        id: entryId,
      },
    });
    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function updateEntry(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Un authorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    const existingEntry = await db.entry.findFirst({
      where: {
        userId: user.id,
        id: data.id,
      },
    });
    if (!existingEntry) throw new Error("Entry Not Found");
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid Mood");

    const updatedEntry = await db.entry.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        collectionId: data.collectionId || null,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);
    return updatedEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getDraft() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Un authorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    const draft = await db.draft.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!draft) throw new Error("Draft Not Found");

    return { success: true, data: draft };
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function saveDraft(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Un authorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    const draft = await db.draft.upsert({
      where: {
        userId: user.id,
      },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });
    revalidatePath("/dashboard");

    return { success: true, data: draft };
  } catch (error) {
    throw new Error(error.message);
  }
}

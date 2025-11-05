"use server";
import { apiDelete } from "@/lib/apiDelete";

export async function deleteItem(url: string) {
	try {
		const response = await apiDelete(url);
		return { success: true };
	} catch (error) {
		console.error("Error deleting item:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

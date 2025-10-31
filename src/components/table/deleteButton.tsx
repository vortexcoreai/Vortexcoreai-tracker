"use client";

import { Trash } from "lucide-react";
import { deleteItem } from "@/app/(frontend)/dashboard/actions/deleteItem";
import { Button } from "../ui/button";

export function DeleteButtonClient({ url, value }) {
	const handleClick = async () => {
		const result = await deleteItem(url);
		if (result.success) {
			alert("Deleted successfully!");
		} else {
			alert(`Failed to delete: ${result.error}`);
		}
	};

	return (
		<Button onClick={handleClick} className=" text-white rounded">
			<Trash />
		</Button>
	);
}

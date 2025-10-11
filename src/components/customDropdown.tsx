"use client";
import { Button } from "./ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDownIcon, ColumnsIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CustomDropdown({ title, data, params }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentValue = searchParams.get(params);

	const handleChange = (newValue) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set(params, newValue);
		router.replace(`${pathname}?${newParams.toString()}`);
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<ColumnsIcon />
					<span className="hidden lg:inline">{title}</span>
					<ChevronDownIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				{data.map((d, index) => {
					const key = Object.keys(d)[0];
					const value = d[key];

					return (
						<DropdownMenuItem
							key={index}
							onClick={() => handleChange(value)}
							className={currentValue === value.toString() ? "font-bold" : ""}
						>
							{key}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

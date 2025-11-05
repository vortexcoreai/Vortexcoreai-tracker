"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiPost } from "@/lib/apiPost";
import { Label } from "./ui/label";

export function DynamicForm({ endpoint, fields, extraData = {}, onSuccess }) {
	const [formData, setFormData] = useState(
		fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}),
	);

	const mutation = useMutation({
		mutationFn: () => apiPost(endpoint, { ...formData, ...extraData }),
		onSuccess: (data) => {
			setFormData(
				fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}),
			);
			if (onSuccess) onSuccess(data);
		},
		onError: (err) => console.error("Failed to submit form", err),
	});

	const handleChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		for (const field of fields) {
			if (field.required && !formData[field.name]) {
				return alert(`${field.label || field.name} is required`);
			}
		}
		mutation.mutate();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{fields.map((field) => {
				if (field.type === "textarea") {
					return (
						<Textarea
							key={field.name}
							value={formData[field.name]}
							onChange={(e) => handleChange(field.name, e.target.value)}
							placeholder={field.placeholder || field.label}
							className="min-h-[120px]"
						/>
					);
				}

				// DATE FIELD
				if (field.type === "date") {
					return (
						<div key={field.name} className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{field.label || field.name}
							</Label>
							<Input
								type="date"
								value={formData[field.name]}
								onChange={(e) => handleChange(field.name, e.target.value)}
								className="w-full"
							/>
						</div>
					);
				}

				// SELECT DROPDOWN
				if (field.type === "select" && field.options) {
					return (
						<div key={field.name} className="space-y-1">
							<Select
								value={formData[field.name]}
								onValueChange={(value) => handleChange(field.name, value)}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={field.placeholder || `Select ${field.label}`}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{field.options.map((option) => (
											<SelectItem key={option} value={option}>
												{option.charAt(0).toUpperCase() + option.slice(1)}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					);
				}

				// TIME FIELD
				if (field.type === "time") {
					return (
						<div key={field.name} className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{field.label || field.name}
							</Label>
							<Input
								type="time"
								value={formData[field.name]}
								onChange={(e) => handleChange(field.name, e.target.value)}
								className="w-full"
							/>
						</div>
					);
				} else {
					return (
						<Input
							key={field.name}
							type={field.type}
							value={formData[field.name]}
							onChange={(e) => handleChange(field.name, e.target.value)}
							placeholder={field.placeholder || field.label}
						/>
					);
				}
			})}
			<Button type="submit" disabled={mutation.isLoading} className="w-full">
				{mutation.isLoading ? "Submitting..." : "Submit"}
			</Button>
		</form>
	);
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiFetchPost } from "@/lib/postApi";

export function DynamicForm({ endpoint, fields, extraData = {}, onSuccess }) {
	const [formData, setFormData] = useState(
		fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}),
	);

	const mutation = useMutation({
		mutationFn: () => apiFetchPost(endpoint, { ...formData, ...extraData }),
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

"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

export function DynamicEditForm({
  endpoint,
  fields,
  values = {},
  extraData = {},
  onSuccess,
}) {
  const [formData, setFormData] = useState(() =>
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: values[field.name] || "" }),
      {}
    )
  );

  useEffect(() => {
    setFormData(
      fields.reduce(
        (acc, field) => ({ ...acc, [field.name]: values[field.name] || "" }),
        {}
      )
    );
  }, [values, fields]);

  const mutation = useMutation({
    mutationFn: (data) =>
      apiPost(endpoint, { ...data, ...extraData }, {}, "PATCH"),
    onSuccess,
    onError: (err) => console.error("Failed to update form", err),
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        alert(`${field.label || field.name} is required`);
        return;
      }
    }

    const formattedData = { ...formData };

    fields.forEach((field) => {
      const value = formData[field.name];
      if (!value) return;

      if (field.type === "time") {
        try {
          const [hours, minutes] = value.split(":");

          const date = new Date();
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          formattedData[field.name] = date.toISOString();
        } catch (error) {
          console.error("Time conversion failed:", error);
        }
      }

      if (field.type === "date") {
        try {
          formattedData[field.name] = new Date(
            `${value}T00:00:00Z`
          ).toISOString();
        } catch (error) {}
      }
    });

    mutation.mutate(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const value = formData[field.name] || "";

        // TEXTAREA
        if (field.type === "textarea") {
          return (
            <Textarea
              key={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder || field.label}
              className="min-h-[120px]"
            />
          );
        }

        // DATE FIELD
        if (field.type === "date") {
          const dateOnly = value?.includes("T") ? value.split("T")[0] : value;
          return (
            <div key={field.name} className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                {field.label || field.name}
              </Label>
              <Input
                type="date"
                value={dateOnly}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </div>
          );
        }

        // TIME FIELD
        if (field.type === "time") {
          const rawValue = formData[field.name];
          const localTime = rawValue.replace("T", "");

          return (
            <div key={field.name} className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                {field.label || field.name}
              </Label>
              <Input
                type="time"
                value={localTime}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </div>
          );
        }

        // SELECT FIELD
        if (field.type === "select" && field.options) {
          return (
            <div key={field.name} className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                {field.label || field.name}
              </Label>
              <Select
                value={value}
                onValueChange={(val) => handleChange(field.name, val)}
              >
                <SelectTrigger>
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

        // DEFAULT INPUT FIELD
        return (
          <div key={field.name} className="space-y-1">
            <Label className="text-sm font-medium text-muted-foreground">
              {field.label || field.name}
            </Label>
            <Input
              type={field.type}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder || field.label}
            />
          </div>
        );
      })}

      <Button type="submit" disabled={mutation.isLoading} className="w-full">
        {mutation.isLoading ? "Updating..." : "Update"}
      </Button>
    </form>
  );
}

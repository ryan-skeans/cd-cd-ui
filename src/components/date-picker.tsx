"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
}

export default function DatePicker({ date, onDateChange }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
        if (date) {
            setInputValue(format(date, "MM/dd/yyyy"));
        } else {
            setInputValue("");
        }
    }, [date]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());

        if (isValid(parsedDate) && parsedDate.getFullYear() > 1900) {
            onDateChange(parsedDate);
        } else if (e.target.value === "") {
            onDateChange(undefined);
        }
    };

    return (
        <div className="flex w-full gap-2">
            <div className="relative flex-1">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-olive text-opacity-70 pointer-events-none" />
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="04/20/2025"
                    className="w-full pl-10 pr-4 h-11 bg-white border-brand-gray/50 focus-visible:ring-brand-olive/50 hover:bg-zinc-50 hover:text-brand-olive transition-all text-brand-olive md:text-sm"
                />
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 shrink-0 bg-white border-brand-gray/50 hover:bg-zinc-50 hover:text-brand-olive text-brand-olive/70"
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-brand-gray/30 text-brand-olive shadow-xl" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            if (d) onDateChange(d);
                            setOpen(false);
                        }}
                        disabled={(d) => d > new Date() || d < new Date("2000-01-01")}
                        initialFocus
                        className="rounded-lg"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

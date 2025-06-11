import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type ModelOption = {
    modelsAvailable: string[]
}

export function ModelOptions({ modelsAvailable }: ModelOption) {
    return (
        <Select name="model">
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent >
                <SelectGroup >
                    <SelectLabel>llama </SelectLabel>
                    {modelsAvailable.map((model) => (
                        <SelectItem key={model} value={model}>
                            {model}
                        </SelectItem>
                    ))}
                </SelectGroup>

            </SelectContent>
        </Select>
    )
}

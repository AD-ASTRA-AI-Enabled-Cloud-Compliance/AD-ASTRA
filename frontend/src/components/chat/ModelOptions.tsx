// components/chat/ModelOptions.tsx
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

type ModelOptionsProps = {
  modelsAvailable: string[]
  value?: string       // <-- new
  onValueChange?: (value: string) => void  // <-- new
}

export function ModelOptions({
  modelsAvailable,
  value,
  onValueChange,
}: ModelOptionsProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>llama</SelectLabel>
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

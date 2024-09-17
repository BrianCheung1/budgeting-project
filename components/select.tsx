"use-client"

import { useMemo } from "react"
import { SingleValue } from "react-select"
import CreateableObject from "react-select/creatable"
import { useTheme } from "next-themes"

type Props = {
  onChange: (value?: string) => void
  onCreate: (value: string) => void
  options?: { label: string; value: string }[]
  value?: string | null | undefined
  disabled?: boolean
  placeholder?: string
}

export const Select = ({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
}: Props) => {
  const { theme } = useTheme() // Get the current theme from NextTheme

  const isLightMode = theme === "light" // Check if the theme is dark

  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value)
  }

  const formattedvalue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  return (
    <CreateableObject
      placeholder={placeholder}
      className="text-sm h-10 "
      styles={{
        control: (base) => ({
          ...base,
          background: isLightMode ? "#FFF" : "#46424f",
          borderColor: isLightMode ? "#e6e8eb" : "#272533",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: isLightMode ? "#FFF" : "#46424f",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#a688fa" : "transparent", // Hover color for options
          color: isLightMode ? "#000" : "#fff", // Change text color on hover
        }),
        singleValue: (base) => ({
          ...base,
          color: isLightMode ? "#000" : "#fff", // Chosen value text color set to white
        }),
        input: (base) => ({
          ...base,
          color: isLightMode ? "#000" : "#fff", // Typed-in text color
        }),
      }}
      value={formattedvalue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  )
}

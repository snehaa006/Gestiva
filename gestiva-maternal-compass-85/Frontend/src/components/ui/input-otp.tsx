import * as React from "react"
import { Dot } from "lucide-react"
import { cn } from "@/lib/utils"

type Slot = {
  char: string
  hasFakeCaret: boolean
  isActive: boolean
}

type OTPInputContextType = {
  slots: Slot[]
  value: string
  focusedIndex: number
  setValue: React.Dispatch<React.SetStateAction<string>>
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>
}

const OTPInputContext = React.createContext<OTPInputContextType | null>(null)

const OTPInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { length?: number; containerClassName?: string }

>(({ length = 6, className, containerClassName, ...props }, ref) => {
  const [value, setValue] = React.useState("")
  const [focusedIndex, setFocusedIndex] = React.useState(0)

  const slots: Slot[] = Array.from({ length }).map((_, i) => ({
    char: value[i] || "",
    hasFakeCaret: focusedIndex === i,
    isActive: focusedIndex === i,
  }))

  // Handle key events to update value and focus
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (value.length > 0 && focusedIndex > 0) {
        const newValue = value.slice(0, focusedIndex - 1) + value.slice(focusedIndex)
        setValue(newValue)
        setFocusedIndex(focusedIndex - 1)
      }
    }
  }

  // Handle input
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!/^\d*$/.test(val)) return // only digits allowed
    if (val.length > 1) val = val.slice(-1)

    const newValue =
      value.slice(0, focusedIndex) + val + value.slice(focusedIndex + 1)
    setValue(newValue)
    if (focusedIndex < length - 1) setFocusedIndex(focusedIndex + 1)
  }

  return (
    <OTPInputContext.Provider
      value={{ slots, value, focusedIndex, setValue, setFocusedIndex }}
    >
      <div
        ref={ref}
        className={cn("flex gap-2", containerClassName)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        {...props}
      >
        {slots.map((slot, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={cn(
              "w-10 h-10 text-center border rounded",
              slot.isActive ? "ring-2 ring-blue-500" : "ring-0"
            )}
            value={slot.char}
            onChange={onChange}
            onFocus={() => setFocusedIndex(i)}
          />
        ))}
      </div>
    </OTPInputContext.Provider>
  )
})
OTPInput.displayName = "OTPInput"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const context = React.useContext(OTPInputContext)
  if (!context) return null
  const { slots } = context
  const slot = slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        slot.isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {slot.char}
      {slot.hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }


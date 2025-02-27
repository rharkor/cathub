"use client"

import { stringToSlug } from "@cathub/api-routes/utils"
import { Checkbox } from "@heroui/checkbox"
import { Input, InputProps } from "@heroui/input"
import { Tooltip } from "@heroui/tooltip"
import { Eye, EyeClosed } from "lucide-react"
import { Ref, useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Controller, FieldPath, FieldValues, Path, UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"

const WithPasswordStrengthPopover = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  form,
  name,
  isFocused,
  showPasswordPopoverCondition,
}: {
  children: React.ReactNode
  form: UseFormReturn<TFieldValues>
  name: TName
  isFocused: boolean
  showPasswordPopoverCondition?: (passwordValue: string) => boolean
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const passwordValue = form.watch(name)
  //? Password strength increase with this pattern:
  // 1. Password length
  // 2. Password contains numbers
  // 3. Password contains lowercase characters
  // 4. Password contains uppercase characters
  // 5. Password contains special characters
  const passwordStrengthValue = passwordValue
    ? [
        passwordValue.length >= 8,
        numberRegex.test(passwordValue),
        lowercaseRegex.test(passwordValue),
        uppercaseRegex.test(passwordValue),
        specialRegex.test(passwordValue),
      ].filter(Boolean).length
    : 0

  const updatePopoverPosition = useCallback(() => {
    const inputWrapper = inputRef.current?.querySelector(".input-wrapper")
    if (!inputWrapper) return
    const position = inputWrapper.getBoundingClientRect()

    if (position && popoverRef.current) {
      popoverRef.current.style.top = `${position.top + position.height + 4}px`
      popoverRef.current.style.left = `${position.left}px`
      popoverRef.current.style.width = `${position.width}px`
    }
  }, [inputRef])

  updatePopoverPosition()

  useEffect(() => {
    window.addEventListener("scroll", updatePopoverPosition)
    window.addEventListener("resize", updatePopoverPosition)

    return () => {
      window.removeEventListener("scroll", updatePopoverPosition)
      window.removeEventListener("resize", updatePopoverPosition)
    }
  }, [updatePopoverPosition])

  //? Display the window only if the password has changes since the last focus
  const [lastFocusPasswordValue, setLastFocusPasswordValue] = useState(passwordValue)
  useEffect(() => {
    if (isFocused) {
      setLastFocusPasswordValue(passwordValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused])

  useEffect(() => {
    // Update position after render
    setTimeout(updatePopoverPosition, 0)
  }, [passwordValue, updatePopoverPosition])

  const [passwordChangedSinceLastFocus, setPasswordChangedSinceLastFocus] = useState(false)

  if (lastFocusPasswordValue !== passwordValue && isFocused && !passwordChangedSinceLastFocus) {
    setPasswordChangedSinceLastFocus(true)
  }

  const isDisplayed =
    isFocused &&
    (showPasswordPopoverCondition ? showPasswordPopoverCondition(passwordValue) : true) &&
    passwordChangedSinceLastFocus &&
    passwordStrengthValue < 5

  return (
    <div className="relative" ref={inputRef}>
      {children}
      {inputRef.current &&
        createPortal(
          <div
            className={cn(
              "pointer-events-none fixed z-50 flex h-max flex-col gap-2 rounded-medium border border-default-100 bg-default-50 p-2 transition-all duration-200 ease-in-out",
              "translate-y-8 opacity-0",
              {
                "pointer-events-auto translate-y-0 opacity-100": isDisplayed,
              }
            )}
            ref={popoverRef}
          >
            <div
              className={cn("h-2 rounded-medium transition-all duration-300 ease-out", {
                "bg-danger-500": passwordStrengthValue < 2,
                "bg-warning": passwordStrengthValue < 5 && passwordStrengthValue >= 2,
                "bg-success": passwordStrengthValue === 5,
              })}
              style={{
                width: `${Math.max(2, (passwordStrengthValue / 5) * 100)}%`,
              }}
            />
            <ul className="flex flex-col">
              <li>
                <Checkbox
                  isSelected={passwordValue.length >= 8}
                  isDisabled
                  color="success"
                  size="sm"
                  data-testid="min-character"
                >
                  Min 8 caractères
                </Checkbox>
              </li>
              <li>
                <Checkbox
                  isSelected={numberRegex.test(passwordValue)}
                  isDisabled
                  color="success"
                  size="sm"
                  data-testid="contain-number"
                >
                  Contient un chiffre
                </Checkbox>
              </li>
              <li>
                <Checkbox
                  isSelected={lowercaseRegex.test(passwordValue)}
                  isDisabled
                  color="success"
                  size="sm"
                  data-testid="contain-lowercase"
                >
                  Contient une lettre minuscule
                </Checkbox>
              </li>
              <li>
                <Checkbox
                  isSelected={uppercaseRegex.test(passwordValue)}
                  isDisabled
                  color="success"
                  size="sm"
                  data-testid="contain-uppercase"
                >
                  Contient une lettre majuscule
                </Checkbox>
              </li>
              <li>
                <Checkbox
                  isSelected={specialRegex.test(passwordValue)}
                  isDisabled
                  color="success"
                  size="sm"
                  data-testid="contain-special-character"
                >
                  Contient un caractère spécial
                </Checkbox>
              </li>
            </ul>
          </div>,
          document.body
        )}
    </div>
  )
}

type IWithPasswordStrengthProps =
  | {
      passwordStrength?: never | false
      passwordtoggleVisibilityProps?: never
      showPasswordPopoverCondition?: never
    }
  | {
      passwordStrength: true
      passwordtoggleVisibilityProps?: React.HTMLAttributes<HTMLButtonElement>
      showPasswordPopoverCondition?: (passwordValue: string) => boolean
    }

export type FormFieldProps<FormValues extends FieldValues, Name extends Path<FormValues>> = Omit<
  InputProps,
  "form" | "name" | "tooltip" | "type"
> & {
  form: UseFormReturn<FormValues>
  name: Name //? Required
  tooltip?: string
  type: InputProps["type"] | "password-eye-slash" | "slug"
} & IWithPasswordStrengthProps

const numberRegex = /[\d]/
const lowercaseRegex = /[a-z]/
const uppercaseRegex = /[A-Z]/
const specialRegex = /[!@#$%^:&*\.]/

export default function FormField<FormValues extends FieldValues, Name extends Path<FormValues>>({
  form,
  name,
  tooltip,
  type,
  passwordStrength,
  inputRef,
  passwordtoggleVisibilityProps,
  showPasswordPopoverCondition,
  ...props
}: FormFieldProps<FormValues, Name> & {
  inputRef?: Ref<HTMLInputElement>
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  const typeToRealType = (type: FormFieldProps<FormValues, Name>["type"]) => {
    switch (type) {
      case "password-eye-slash":
        return isVisible ? "text" : "password"
      case "slug":
        return "text"
      default:
        return type
    }
  }

  let input = (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <Input
          {...field}
          {...props}
          className={cn(
            {
              "relative z-[1]": type === "password-eye-slash",
            },
            props.className
          )}
          classNames={{
            inputWrapper: "input-wrapper",
          }}
          ref={inputRef}
          onFocusChange={setIsFocused}
          type={typeToRealType(type)}
          isInvalid={props.isInvalid !== undefined ? props.isInvalid : !!form.formState.errors[name]}
          errorMessage={
            props.errorMessage !== undefined ? props.errorMessage : form.formState.errors[name]?.message?.toString()
          }
          endContent={
            props.endContent ||
            (type === "password-eye-slash" ? (
              <button
                className="text-2xl text-default-400 hover:text-primary focus:text-primary focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                {...passwordtoggleVisibilityProps}
              >
                {isVisible ? (
                  <EyeClosed className="pointer-events-none transition-all" />
                ) : (
                  <Eye className="pointer-events-none transition-all" />
                )}
              </button>
            ) : undefined)
          }
          onChange={type === "slug" ? (e) => field.onChange(stringToSlug(e.target.value)) : field.onChange}
        />
      )}
    />
  )

  if (passwordStrength) {
    input = (
      <WithPasswordStrengthPopover
        form={form}
        name={name}
        isFocused={isFocused}
        showPasswordPopoverCondition={showPasswordPopoverCondition}
      >
        {input}
      </WithPasswordStrengthPopover>
    )
  }

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        <div className="relative">{input}</div>
      </Tooltip>
    )
  }

  return input
}

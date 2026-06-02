import * as React from "react"
import { useFormContext, FormProvider, useForm, Controller, ControllerProps, FieldPath, FieldValues, UseFormReturn } from "react-hook-form"

const Form = React.forwardRef<
  HTMLFormElement,
  any
>(({ children, ...props }, ref) => {
  return (
    <FormProvider {...(props as UseFormReturn<any>)}>
      {children}
    </FormProvider>
  )
})
Form.displayName = "Form"

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={className} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext)
  
  return (
    <label
      ref={ref}
      className={className}
      htmlFor={id}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ ...props }, ref) => {
  const { id } = React.useContext(FormItemContext)
  
  return (
    <div
      ref={ref}
      id={id}
      aria-describedby={`${id}-form-item-description ${id}-form-item-message`}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, children, ...props }, ref) => {
  const { formState } = useFormContext()
  const { id } = React.useContext(FormItemContext)
  const error = formState.errors[id as any]
  const body = error?.message ? String(error.message) : children
  
  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={`${id}-form-item-message`}
      className={className}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
}

import * as React from "react"
import { Toast } from "@radix-ui/react-toast"

interface ToastProps extends React.ComponentPropsWithoutRef<typeof Toast> {
  title?: string
  description?: string
}

const useToast = () => {
  const [open, setOpen] = React.useState(false)
  const [props, setProps] = React.useState<ToastProps>({})

  const toast = React.useCallback((props: ToastProps) => {
    setProps(props)
    setOpen(true)
  }, [])

  return {
    toast,
    open,
    setOpen,
    ...props,
  }
}

export { useToast }
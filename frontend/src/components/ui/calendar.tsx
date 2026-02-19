'use client'

import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import {
  DayPicker,
  getDefaultClassNames,
  type DayButtonProps,
} from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn(
        'bg-background p-3',
        className,
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('flex flex-col md:flex-row gap-4', defaultClassNames.months),
        month: cn('flex flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-8 w-8 p-0',
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-8 w-8 p-0',
        ),
        caption_label: cn('text-sm font-medium'),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground flex-1 text-xs text-center',
          defaultClassNames.weekday,
        ),
        week: cn('flex w-full', defaultClassNames.week),
        day: cn(
          'relative flex-1 aspect-square',
          defaultClassNames.day,
        ),
        today: cn(
          'bg-accent text-accent-foreground rounded-md',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-muted-foreground opacity-50',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'opacity-50 text-muted-foreground',
          defaultClassNames.disabled,
        ),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className }) => {
          if (orientation === 'left')
            return <ChevronLeftIcon className={cn('h-4 w-4', className)} />
          if (orientation === 'right')
            return <ChevronRightIcon className={cn('h-4 w-4', className)} />
          return <ChevronDownIcon className={cn('h-4 w-4', className)} />
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children }) => (
          <div className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground">
            {children}
          </div>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8 p-0',
        modifiers.selected && 'bg-primary text-primary-foreground',
        modifiers.range_middle && 'bg-accent',
        className,
      )}
      {...props}
    />
  )
}

export { Calendar }


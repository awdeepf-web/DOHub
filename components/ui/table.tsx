import * as React from 'react';
import { cn } from '@/utils/cn';

type TableProps = React.HTMLAttributes<HTMLTableElement>;
type SectionProps = React.HTMLAttributes<HTMLTableSectionElement>;
type RowProps = React.HTMLAttributes<HTMLTableRowElement>;
type HeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;
type CellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, ...props },
  ref,
) {
  return (
    <div className="w-full overflow-auto rounded-md border">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
});

const TableHeader = React.forwardRef<HTMLTableSectionElement, SectionProps>(
  function TableHeader({ className, ...props }, ref) {
    return <thead ref={ref} className={cn('bg-muted/50 [&_tr]:border-b', className)} {...props} />;
  },
);

const TableBody = React.forwardRef<HTMLTableSectionElement, SectionProps>(
  function TableBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
  },
);

const TableRow = React.forwardRef<HTMLTableRowElement, RowProps>(function TableRow(
  { className, ...props },
  ref,
) {
  return <tr ref={ref} className={cn('border-b transition-colors hover:bg-muted/50', className)} {...props} />;
});

const TableHead = React.forwardRef<HTMLTableCellElement, HeadProps>(function TableHead(
  { className, ...props },
  ref,
) {
  return (
    <th
      ref={ref}
      className={cn('h-11 px-4 text-left align-middle font-medium text-muted-foreground', className)}
      {...props}
    />
  );
});

const TableCell = React.forwardRef<HTMLTableCellElement, CellProps>(function TableCell(
  { className, ...props },
  ref,
) {
  return <td ref={ref} className={cn('p-4 align-middle', className)} {...props} />;
});

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
import React from 'react'
import { ArrowDownAz, ArrowUpAZ, FilterIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { Column } from '@tanstack/react-table';
// import { getStatusIconByStatus } from '@/app/app/(features)/management/projects/stage/components/MultiMetricProgress';

export type HeaderType<TData = unknown, TValue = unknown> = {
  colName: string;
  column: Column<TData, TValue>;
  data: unknown
};

function getSortIcon(sort: false | "asc" | "desc") {
  if (sort === "asc") return <ArrowDownAz size={10} color='red'  />;
  if (sort === "desc") return <ArrowUpAZ size={10} color='red'  />;
  return <ArrowUpAZ size={10} />;
}
const TableHeaderFilterSort = <TData, TValue>({
  colName,
  column,
}: HeaderType<TData, TValue>) => {
  return (
    <div className="capitalize flex flex-row justify-center items-center gap-1">
      <>
      {colName}
      </>
      <Link
        className="capitalize flex flex-row justify-center items-center hover:border-solid hover:border-amber-200 hover:border-1"
        href=""
        onClick={(e) => {
          e.preventDefault();
          column.toggleSorting(
            column.getIsSorted() === "asc",
            e.shiftKey
          );
        }}
      >
        {getSortIcon(column.getIsSorted())}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hover:text-blue-900">
          <FilterIcon size={10}  />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableHeaderFilterSort

export function FacetedFilter({ column }: { column: Column<unknown> }) {
  const options = Array.from(column.getFacetedUniqueValues().keys())
    .filter((v) => v != null)
    .sort();

  // const selectedValue = column.getFilterValue();

  return (
    <select
      value={''}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      className="border rounded p-1"
    >
      <option value="">All</option>
      {/* {options.map((val) => (

        <option key={val} value={val}>
          {getStatusIconByStatus(val).label ?? val}
        </option>
      ))} */}
    </select>
  );
}

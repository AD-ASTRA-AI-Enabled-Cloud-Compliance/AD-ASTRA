import { ChevronsLeft, ChevronLeft, ChevronRightIcon, ChevronsRight, ChevronDown, List, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useConstantContext } from "@/contexts/constants-povider"
import { Input } from "../ui/input"
import { Table } from "@tanstack/react-table"
import { useState } from "react"
import WrapperInput from "../ui/WrapperInput"
type DataContextReturn<T> = {
    data: T[];
    dataLength: number;
    filter: string;
    setFilter: (val: string) => void;
};
type TableNavigationsTypes<T, Ctx extends DataContextReturn<T>> = {
    table: Table<T>;
    useDataContext: () => Ctx;
    filters?: Record<string, unknown>;
    AddFilterOptions?: number[] | null;
};

export const TableNavigations = <T, Ctx extends DataContextReturn<T>>({
    table,
    AddFilterOptions,
    filters
}: TableNavigationsTypes<T, Ctx>) => {

    const filterOptions = AddFilterOptions ? AddFilterOptions : [10, 20, 30, 40, 50];
    const [filter, setFilter] = useState<string>('');
    const { tableView, setTableView } = useConstantContext();
    if (filters) {
        Object.entries(filters).map(([index, item]) => {
            console.log(index, item)
        }
        )
    }

    return (
        <div className="pb-3">
            <div className="flex flex-row justify-center text-sm text-muted-foreground">

                <div className="text-sm flex text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length > 0 ?
                        <>
                            {table.getFilteredSelectedRowModel().rows.length}
                            {/* of */}
                            {" "}
                            {/* {table.getFilteredRowModel().rows.length}  */}
                            row(s) selected.
                            <Separator orientation="vertical" className="mx-2 " />

                        </>
                        :
                        <>
                        </>
                    }
                    {table.getFilteredRowModel().rows.length} row(s)
                    <Separator orientation="vertical" className="mx-2 " />
                </div>


                <div className="flex text-sm text-muted-foreground">
                    <strong>

                        Page{' '}
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                    <Separator orientation="vertical" className="mx-2 " />


                </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center justify-start">
                    <div className="space-x-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Show {table.getState().pagination.pageSize} <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {filterOptions.map(pageSize => (
                                    <DropdownMenuItem
                                        key={pageSize}
                                        onClick={() => table.setPageSize(pageSize)}
                                    >
                                        <div className="text-sm">
                                            <b>{pageSize}</b> rows
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="space-x-2 flex flex-row  items-center justify-start">
                    <Button variant="outline" size="icon" onClick={() => setTableView(!tableView)}>
                        {tableView ? <LayoutGrid /> : <List />}
                    </Button>
                </div>
                <div className="space-x-1 flex flex-row  items-center justify-center">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button variant="outline" size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>

                    <Input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border text-center"

                    />
                    <Button variant="outline" size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRightIcon />
                    </Button>
                    <Button variant="outline" size="icon"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
                <div>

                    <WrapperInput inptype='text'
                        fiedlName="search"
                        placeholder={'Search...'}
                        onInputChange={(e) => {
                            if (typeof e === 'string') {
                                setFilter(e);
                            } else {
                                setFilter(e.target.value);
                            }
                        }}
                        value={filter} />
                </div>
            </div>
        </div>
    )
}
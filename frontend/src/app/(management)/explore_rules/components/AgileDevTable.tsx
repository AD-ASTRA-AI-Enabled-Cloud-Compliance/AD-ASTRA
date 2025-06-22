

'use client'

import * as React from 'react'
import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, PaginationState, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { TableNavigations } from '@/components/dataTable/TableNavigations'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'


import { RulePoint, RuleRow, columnsRules } from './lib'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Loader from '@/components/ui/loader'
import { useRulesDataContext } from './DataContext_Rules'




// Query block instead of using state
// const searchParams = useSearchParams();
// const uuid = searchParams.get("uuid");

export function RulesTable() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20, })

    const { dataRules, setDataRules, setSelctedRules, selectedRules } = useRulesDataContext();
    //DEV: Import the context from the related parent if applicable

    const handleRowClick = (selected_child: string) => {
        const found = dataRules.find((item) => item.id === selected_child)
        if (found) {
            setSelctedRules(found);
        }
    };

    const cols = columnsRules({
        selectedAction: handleRowClick,
        selectedValue: selectedRules,
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch("http://localhost:3001/explore/rules");
    //             const res = await response.json();
    //             setDataRules(res.points);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     fetchData();
    // }, []);
    const fetchDataAsync = async () => {
        try {
            setLoading(true);
            setError(false);

            //DEV: Replace the uuid parameter with the value of the state if applicable
                const response = await fetch("http://localhost:3001/explore/rules");
            if (response) {

                const res = await response.json()
                // if (!res.ok) throw new Error("Bad response");
                
                const points: RulePoint[] = res.points;
                console.log(points)
                // setDataRules(points);

                // Flatten RulePoint to RuleRow
                const tableData: RuleRow[] = points.map(point => ({
                id: point.id, // top-level id
                ...point.payload, // spread payload fields
                }));

                setDataRules(tableData); // assumes your table expects RuleRow[]

            }
        } catch {
            console.error("Failed to fetch");
            setError(true);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDataAsync();
    }, []);

    const table = useReactTable<RuleRow>({
        data: dataRules,
        columns: cols,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })


    if (loading) {
        return (
            <Loader />
        )
    }
    if (error) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-xl font-bold'>Error fetching data</h1>
                <p className='text-gray-500'>Please try again later.</p>
            </div>
        )
    }
    if (dataRules == null || dataRules.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-xl font-bold'>No Data available</h1>
                <p className='text-gray-500'>Please add some.</p>
            </div>
        )
    }
    return (
        <div className='flex flex-row gap-4 p-4'>
            <div>
                {selectedRules == null ? null :
                    <div>
                        <Card>

                            <CardContent className='flex flex-col items-center justify-between'>
                                <div className='flex flex-row items-center gap-2'>
                                    <Label className='text-sm font-bold'>
                                    </Label>
                                    <Button onClick={() => setSelctedRules(null)} variant='outline' className=''>
                                        <X size={16} />
                                    </Button>
                                </div>

                            </CardContent>
                            <CardContent className='w-[200px] overflow-auto'>
                                {/* {JSON.stringify(dataRules.find((item) => item.selected_child_name === selectedRules))} */}
                            </CardContent>
                        </Card>
                    </div>
                }
            </div>
            <div>
                {/* <TableNavigations table={table} useDataContext={useRulesAdapter} /> */}

                <div className='w-full'>
                    <div className='rounded-md border'>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && 'selected'}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columnsRules.length} className='h-24 text-center' >
                                            <Loader />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {/* <TableNavigations table={table} useDataContext={useRulesAdapter} /> */}

            </div>
        </div>
    )
}

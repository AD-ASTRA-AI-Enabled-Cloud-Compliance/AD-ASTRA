
import { ColumnDef } from "@tanstack/react-table";
import TableHeaderFilterSort from "@/components/dataTable/TableHeaderFilterSort";
import { Checkbox } from "@/components/ui/checkbox";


const data: RuleRow[] = [];
export type RuleRow = RulePayload & {
    id: string; // from RulePoint
  };
export type RulePayload = {
    doc_id: string;
    rule: string;
    category: string;
    framework: string;
    rule_id: string;
    model: string;
};

export type RulePoint = {
    id: string;
    payload: RulePayload;
    vector: number[] | null;
    shard_key: string | null;
    order_value: number | null;
};

export type RuleResponse = {
    points: RulePoint[];
};

type ColumnProps = {
    selectedAction?: (row: string) => void;
    selectedValue?: RuleRow | null;
};

export const columnsRules = ({ selectedAction, selectedValue }: ColumnProps): ColumnDef<RuleRow>[] => [

    {
        id: 'select',
        enableSorting: true,
        enableHiding: false,
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />),
    },
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <TableHeaderFilterSort
                    colName='id'
                    column={column}
                    data={data}
                />
            )
        },
        cell: ({ row }) => <div className='capitalize  text-center'>
            {row.getValue('id')}
        </div>,
    },
    {
        
        accessorKey: 'model',
        size: 50,
        header: ({ column }) => {
            return (
                <TableHeaderFilterSort
                    colName='model'
                    column={column}
                    data={data}
                />
            )
        },
        cell: ({ row }) => {
            return <>
                <div className='capitalize  text-center w-[100%] justify-center flex flex-row items-center truncate'>
                    <div className="w-[90%]">
                        {row.getValue('model')}
                    </div >
                </div>
            </>
        }

    },
    
    {
        
        accessorKey: 'framework',
        size: 50,
        header: ({ column }) => {
            return (
                <TableHeaderFilterSort
                    colName='framework'
                    column={column}
                    data={data}
                />
            )
        },
        cell: ({ row }) => {
            return <>
                <div className='capitalize  text-center w-[100%] justify-center flex flex-row items-center truncate'>
                    <div className="w-[90%]">
                        {row.getValue('framework')}
                    </div >
                </div>
            </>
        }

    },
    {
        
        accessorKey: 'category',
        size: 50,
        header: ({ column }) => {
            return (
                <TableHeaderFilterSort
                    colName='category'
                    column={column}
                    data={data}
                />
            )
        },
        cell: ({ row }) => {
            return <>
                <div className='capitalize  text-center w-[100%] justify-center flex flex-row items-center truncate'>
                    <div className="w-[90%]">
                        {row.getValue('category')}
                    </div >
                </div>
            </>
        }

    },
    {
        
        accessorKey: 'rule',
        size: 50,
        header: ({ column }) => {
            return (
                <TableHeaderFilterSort
                    colName='rule'
                    column={column}
                    data={data}
                />
            )
        },
        cell: ({ row }) => {
            return <>
                <div className='capitalize  text-center w-[100%] justify-center flex flex-row items-center truncate'>
                    <div className="w-[90%]">
                        {row.getValue('rule')}
                    </div >
                </div>
            </>
        }

    },
    {
        
        accessorKey: 'doc_id',
        size: 50,
        header: ({ column }) => {
            return (
                <TableHeaderFilterSort
                    colName='doc_id'
                    column={column}
                    data={data}
                />
            )
        },
        cell: ({ row }) => {
            return <>
                <div className='capitalize  text-center w-[100%] justify-center flex flex-row items-center truncate'>
                    <div className="w-[90%]">
                        {row.getValue('doc_id')}
                    </div >
                </div>
            </>
        }

    },
    {
        
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const dataRow = row.original
            return (
                <>
                    {/* <RulesForm
                        item={dataRow}
                    /> */}
                </>
            )
        },

    },
]
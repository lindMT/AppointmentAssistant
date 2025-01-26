import React, { useState } from "react";
import { 
    useReactTable, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    getPaginationRowModel,
    getFilteredRowModel
} from "@tanstack/react-table";

export default function DynamicTable({data, columns, tableTitle}){
    
    const [filter, setFilter] = useState(""); 
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5, 
    });


    const usersTable = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
          pagination,
          globalFilter: filter
        },
        onGlobalFilterChange: setFilter
    });
    
    return (
        <div>
            <h2>{tableTitle}</h2>
            <br />

            <div>
                <label>Search:</label>
                <input
                    type="text"
                    placeholder="Search"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            
            <table class="content-table">
                <thead>
                    {usersTable.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    style={{ cursor: "pointer" }}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() === "asc" && " ↑"}
                                    {header.column.getIsSorted() === "desc" && " ↓"}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {usersTable.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                onClick={() => usersTable.previousPage()}
                disabled={!usersTable.getCanPreviousPage()}
            >
                Previous
            </button>
            <button 
                onClick={() => usersTable.nextPage()} 
                disabled={!usersTable.getCanNextPage()}
            >
                Next
            </button>
        </div>
    );
}
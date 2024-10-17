import React, { CSSProperties } from "react";
// import ReactDOM from "react-dom/client";

import {
	Cell,
	ColumnDef,
	Header,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

// needed for table body level scope DnD setup
import {
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	closestCenter,
	type DragEndEvent,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { IBusinessData } from "@/lib/types/apiTypes";
import { useMappingsCtx } from "@/lib/stores/MappingsCtx";
import { Table, Tbody, Td, Th, Thead } from "@chakra-ui/react";

interface HomeViewProps {
	data: IBusinessData[];
}

export const HomeViewDraggable: React.FC<HomeViewProps> = ({ data }) => {
	const mappings = useMappingsCtx();
	// console.log("data", data);

	const columns = React.useMemo<ColumnDef<IBusinessData>[]>(
		() =>
			Object.keys(mappings.map).map((item) => ({
				accessorKey: item,
				header: mappings.map[item as keyof typeof mappings].header,
				id: item,
				size: mappings.map[item as keyof typeof mappings].size,
			})),
		[mappings.map]
	);

	const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
		columns.map((c) => c.id!)
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			columnOrder,
		},
		onColumnOrderChange: setColumnOrder,
		// debugTable: true,
		// debugHeaders: true,
		// debugColumns: true,
	});

	// reorder columns after drag & drop
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setColumnOrder((columnOrder) => {
				const oldIndex = columnOrder.indexOf(active.id as string);
				const newIndex = columnOrder.indexOf(over.id as string);
				return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
			});
		}
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	return (
		<DndContext
			collisionDetection={closestCenter}
			modifiers={[restrictToHorizontalAxis]}
			onDragEnd={handleDragEnd}
			sensors={sensors}
		>
			<Table variant={"striped"}>
				<Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							<SortableContext
								items={columnOrder}
								strategy={horizontalListSortingStrategy}
							>
								{headerGroup.headers.map((header) => (
									<DraggableTableHeader
										key={header.id}
										header={header}
									/>
								))}
							</SortableContext>
						</tr>
					))}
				</Thead>
				<Tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<SortableContext
									key={cell.id}
									items={columnOrder}
									strategy={horizontalListSortingStrategy}
								>
									<DragAlongCell
										key={cell.id}
										cell={cell}
									/>
								</SortableContext>
							))}
						</tr>
					))}
				</Tbody>
			</Table>
		</DndContext>
	);
};

const DraggableTableHeader = ({
	header,
}: {
	header: Header<IBusinessData, unknown>;
}) => {
	const { attributes, isDragging, listeners, setNodeRef, transform } =
		useSortable({
			id: header.column.id,
		});

	const style: CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
		transition: "width transform 0.2s ease-in-out",
		whiteSpace: "nowrap",
		width: header.column.getSize(),
		zIndex: isDragging ? 1 : 0,
	};

	return (
		<Th
			colSpan={header.colSpan}
			ref={setNodeRef}
			style={style}
		>
			{header.isPlaceholder
				? null
				: flexRender(header.column.columnDef.header, header.getContext())}
			<button
				{...attributes}
				{...listeners}
				style={{ cursor: "grab", marginLeft: 20 }}
			>
				🟰
			</button>
		</Th>
	);
};

const DragAlongCell = ({ cell }: { cell: Cell<IBusinessData, unknown> }) => {
	const { isDragging, setNodeRef, transform } = useSortable({
		id: cell.column.id,
	});

	const style: CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
		transition: "width transform 0.2s ease-in-out",
		width: cell.column.getSize(),
		zIndex: isDragging ? 1 : 0,
	};

	return (
		<Td
			style={style}
			ref={setNodeRef}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</Td>
	);
};

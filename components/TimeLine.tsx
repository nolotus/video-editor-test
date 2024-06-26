"use client";

import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo, useEffect, Dispatch, SetStateAction } from "react";
import Row from "./Row";
import Clip from "./Clip";
import Subrow from "./Subrow";
import Sidebar from "./Sidebar";
import { generateRows } from "@/utils";

interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
  setRows: Dispatch<SetStateAction<RowDefinition[]>>;
  selectId: string;
}

function Timeline(props: TimelineProps) {
  const { setTimelineRef, style, timeframe } = useTimelineContext();
  const { rows, setRows, selectId } = props;
  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(props.items, timeframe),
    [props.items, timeframe]
  );

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    const firstRowId = rows[0].id;

    const lastRowId = rows[rows.length - 1].id;

    if (groupedSubrows[firstRowId]) {
      let newRows = [...rows];
      let newRow = generateRows(1);
      newRows.unshift(newRow[0]);
      setRows(newRows);
    }

    if (groupedSubrows[lastRowId]) {
      let newRows = [...rows];
      let newRow = generateRows(1);
      newRows.push(newRow[0]);
      setRows(newRows);
    }
  }, [rows, groupedSubrows, setRows]);

  return (
    <div
      ref={setTimelineRef}
      style={style}
      className="bg-black gap-2 w-full h-full border border-gray-500"
    >
      {props.rows.map((row) => (
        <Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
          {groupedSubrows[row.id]?.map((subrow, index) => (
            <Subrow key={`${row.id}-${index}`}>
              {subrow.map((item) => (
                <Clip
                  id={item.id}
                  key={item.id}
                  relevance={item.relevance}
                  isSelected={item.id === selectId}
                >
                  {`Clip ${item.id}`}
                </Clip>
              ))}
            </Subrow>
          ))}
        </Row>
      ))}
    </div>
  );
}

export default Timeline;

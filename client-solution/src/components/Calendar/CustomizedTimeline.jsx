import React, { useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab', // ✅ Покращує UX, показуючи, що елемент можна перетягувати
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function CustomizedTimeline() {
  const timelineItems = {
    eat: {
      id: 'eat',
      time: '9:30 am',
      title: 'Eat',
      description: 'Because you need strength',
      icon: <FastfoodIcon />,
      dotProps: {},
    },
    code: {
      id: 'code',
      time: '10:00 am',
      title: 'Code',
      description: "Because it's awesome!",
      icon: <LaptopMacIcon />,
      dotProps: { color: 'primary' },
    },
    sleep: {
      id: 'sleep',
      time: '', //
      title: 'Sleep',
      description: 'Because you need rest',
      icon: <HotelIcon />,
      dotProps: { variant: 'outlined', color: 'primary' },
    },
    repeat: {
      id: 'repeat',
      time: '',
      title: 'Repeat',
      description: 'Because this is the life you love!',
      icon: <RepeatIcon />,
      dotProps: { color: 'secondary' },
    },
  };

  const [itemsOrder, setItemsOrder] = useState(Object.keys(timelineItems));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItemsOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemsOrder} strategy={verticalListSortingStrategy}>
        <Timeline position="alternate">
          {itemsOrder.map((id) => {
            const item = timelineItems[id];
            return (
              <SortableItem key={id} id={id}>
                <TimelineItem>
                  {item.time && (
                    <TimelineOppositeContent
                      sx={{ m: 'auto 0' }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.time}
                    </TimelineOppositeContent>
                  )}
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot {...item.dotProps}>
                      {item.icon}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      {item.title}
                    </Typography>
                    <Typography>{item.description}</Typography>
                  </TimelineContent>
                </TimelineItem>
              </SortableItem>
            );
          })}
        </Timeline>
      </SortableContext>
    </DndContext>
  );
}

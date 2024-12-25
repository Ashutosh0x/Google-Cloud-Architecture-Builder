"use client"

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import Image from 'next/image'
import { X } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const BASE_URL = "https://raw.githubusercontent.com/Ashutosh0x/google-icons/refs/heads/main"

export const ServiceNode = memo(({ data, isConnectable, id }: NodeProps) => {
  const onDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <Card className="min-w-40 border-primary/20 dark:bg-gray-800 dark:border-gray-700 relative group">
      <CardContent className="flex items-center gap-3 p-3">
        <Image
          src={`${BASE_URL}/${data.icon}.svg`}
          alt={data.label}
          width={24}
          height={24}
          className="h-6 w-6"
          unoptimized
        />
        <span className="text-sm font-medium dark:text-white">{data.label}</span>
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-5 w-5 p-0 bg-red-500 hover:bg-red-600"
          onClick={onDelete}
        >
          <X className="h-2 w-2" />
        </Button>
      </CardContent>
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{ top: 0, background: "#555" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ right: 0, background: "#555" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ bottom: 0, background: "#555" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ left: 0, background: "#555" }}
        isConnectable={isConnectable}
      />
    </Card>
  )
})
ServiceNode.displayName = "ServiceNode"


"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Box } from "@chakra-ui/react"
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis } from "recharts"

export interface LocationPoint {
  location: string
  averageBedrooms: number
  averageBathrooms: number
}

export function LocationAreaChart({ data }: { data: LocationPoint[] }) {
  const chart = useChart({
    data: data.map((d) => ({
      location: d.location,
      bedrooms: d.averageBedrooms,
      bathrooms: d.averageBathrooms,
    })),
    series: [
      { name: "bedrooms", color: "blue.solid" },
      { name: "bathrooms", color: "purple.solid" },
    ],
  })

  return (
    <Box w="full">
      <Chart.Root maxH="sm" chart={chart}>
        <AreaChart data={chart.data}>
          <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
          <XAxis axisLine={false} tickLine={false} dataKey={chart.key("location")} />
          <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
          <Legend content={<Chart.Legend />} />
          {chart.series.map((item) => (
            <Area
              key={item.name}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
              fill={chart.color(item.color)}
              fillOpacity={0.2}
              stroke={chart.color(item.color)}
              stackId="a"
            />
          ))}
        </AreaChart>
      </Chart.Root>
    </Box>
  )
}

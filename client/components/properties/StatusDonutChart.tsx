"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Box } from "@chakra-ui/react"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

export interface StatusDonutChartProps {
  available: number
  sold: number
}

export function StatusDonutChart({ available, sold }: StatusDonutChartProps) {
  const chart = useChart({
    data: [
      { name: "Available", value: available, color: "green.solid" },
      { name: "Sold", value: sold, color: "red.solid" },
    ],
  })

  return (
    <Box w="full">
      <Chart.Root maxW="md" chart={chart} mx="auto">
        <PieChart>
          <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip hideLabel />} />
          <Pie
            innerRadius={60}
            outerRadius={90}
            isAnimationActive={false}
            data={chart.data}
            dataKey={chart.key("value")}
            nameKey={chart.key("name")}
          >
            {chart.data.map((item) => (
              <Cell key={item.name} fill={chart.color(item.color)} />
            ))}
          </Pie>
        </PieChart>
      </Chart.Root>
    </Box>
  )
}

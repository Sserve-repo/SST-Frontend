"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Jan 1",
    bookings: 145,
    users: 34,
  },
  {
    date: "Jan 2",
    bookings: 132,
    users: 28,
  },
  // Add more data points...
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}


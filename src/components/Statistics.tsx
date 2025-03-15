import React from "react";
import { TaskStatistics } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticsProps {
  statistics: TaskStatistics;
}

const COLORS = {
  completed: "#16a34a",  // Green
  pending: "#ea580c",    // Orange
  overdue: "#dc2626",    // Red
  work: "#3b82f6",       // Blue
  personal: "#8b5cf6",   // Purple
  health: "#06b6d4",     // Cyan
  finance: "#65a30d",    // Lime
  other: "#94a3b8",      // Slate
  high: "#ef4444",       // Red
  medium: "#f59e0b",     // Amber
  low: "#10b981",        // Emerald
};

const Statistics: React.FC<StatisticsProps> = ({ statistics }) => {
  // Prepare data for category chart
  const categoryData = Object.entries(statistics.tasksByCategory).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: COLORS[category as keyof typeof COLORS] || COLORS.other,
  }));

  // Prepare data for priority chart
  const priorityData = Object.entries(statistics.tasksByPriority).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count,
    color: COLORS[priority as keyof typeof COLORS] || COLORS.other,
  }));

  // Prepare data for completion chart
  const completionData = [
    { name: "Completed", value: statistics.completedTasks, color: COLORS.completed },
    { name: "Pending", value: statistics.pendingTasks, color: COLORS.pending },
    { name: "Overdue", value: statistics.overdueTasks, color: COLORS.overdue },
  ];

  // Prepare data for completion rate by day chart
  const completionByDayData = Object.entries(statistics.tasksCompletedByDay)
    .sort(([dayA], [dayB]) => new Date(dayA).getTime() - new Date(dayB).getTime())
    .map(([day, count]) => ({
      name: new Date(day).toLocaleDateString(undefined, { weekday: 'short' }),
      value: count,
    })).slice(-7); // Last 7 days

  const chartConfig = {
    completed: { color: COLORS.completed, label: "Completed" },
    pending: { color: COLORS.pending, label: "Pending" },
    overdue: { color: COLORS.overdue, label: "Overdue" },
    work: { color: COLORS.work, label: "Work" },
    personal: { color: COLORS.personal, label: "Personal" },
    health: { color: COLORS.health, label: "Health" },
    finance: { color: COLORS.finance, label: "Finance" },
    other: { color: COLORS.other, label: "Other" },
    high: { color: COLORS.high, label: "High" },
    medium: { color: COLORS.medium, label: "Medium" },
    low: { color: COLORS.low, label: "Low" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(statistics.completionRate * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks by Status */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
          <CardDescription>Distribution of task completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
              id="task-status-chart"
            >
              <PieChart>
                <Pie
                  data={completionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => 
                    `${name}: ${Math.round(percent * 100)}%`
                  }
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Category */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Tasks by Category</CardTitle>
          <CardDescription>Number of tasks in each category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
              id="task-category-chart"
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => 
                    `${name}: ${Math.round(percent * 100)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
          <CardDescription>Tasks completed in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionByDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tasks Completed" fill={COLORS.completed} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;

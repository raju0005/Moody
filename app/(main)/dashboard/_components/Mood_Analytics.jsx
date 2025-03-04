"use client";
import { getAnalytics } from "@/actions/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import MoodAnalyticsLoader from "./MoodAnalyticsLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMoodById, getMoodTrend } from "@/app/lib/mood";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

const timeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
];
const Mood_Analytics = () => {
  const [period, setPeriod] = useState("7d");
  const {
    loading,
    data: analytics,
    fn: fetchAnalysis,
  } = useFetch(getAnalytics);
  const { isLoaded } = useUser();

  useEffect((period) => {
    fetchAnalysis(period);
  }, []);

  if (loading || !analytics?.data || !isLoaded) {
    return <MoodAnalyticsLoader />;
  }
  const { timeLine, stats } = analytics.data;
  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">
            {format(parseISO(label), "MMM d, yyyy")}
          </p>
          <p className="text-amber-600">Average Mood: {payload[0].value}</p>
          <p className="text-blue-600">Entries: {payload[1]?.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="md:text-5xl text-4xl font-custom uppercase text-gradient-xl">
          Dashboard
        </h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[150px] font-bold ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className=" font-bold">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold">
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold">{stats.totalEntries}</p>
              <p className="text-sm text-muted-foreground">
                ~{stats.dailyAverage} entries per day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold">
                Average Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold">{stats.averageScore}/10</p>
              <p className="text-sm text-muted-foreground">
                Overall mood score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold">
                Mood Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold flex items-center gap-2 ">
                {getMoodById(stats.mostFrequentMood)?.emoji}{" "}
                {getMoodTrend(stats.averageScore)}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-bold">Mood Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full ">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={timeLine}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(parseISO(date), "MMM d")}
                  />
                  <YAxis yAxisId="left" domain={[0, 10]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, "auto"]}
                  />
                  <Tooltip content={<CustomToolTip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#f97316"
                    name="Average Mood"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="entryCount"
                    stroke="#3b82f6"
                    name="Number of Entries"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default Mood_Analytics;

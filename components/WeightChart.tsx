import { useFont } from '@shopify/react-native-skia';
import { format, subWeeks } from 'date-fns';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserWeightHistory } from '~/lib/weight';

interface WeightHistory {
  date: string;
  weight: number;
}

const getLast4Weeks = (weightHistory: WeightHistory[]) => {
  const today = new Date();
  const last4Weeks = [3, 2, 1, 0].map((weeksAgo) =>
    format(subWeeks(today, weeksAgo), 'yyyy-MM-dd')
  );

  const startDate = last4Weeks[0];
  const endDate = last4Weeks[last4Weeks.length - 1];
  const allDates = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    allDates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  allDates.push(format(currentDate, 'yyyy-MM-dd'));

  allDates.forEach((date) => {
    if (!weightHistory.some((entry) => entry.date === date)) {
      const previousEntry = weightHistory
        .filter((entry) => entry.date < date)
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .pop();

      let weightToUse;

      if (previousEntry) {
        weightToUse = previousEntry.weight;
      } else {
        const futureEntry = weightHistory
          .filter((entry) => entry.date > date)
          .sort((a, b) => (a.date < b.date ? -1 : 1))
          .shift();

        if (futureEntry) {
          weightToUse = futureEntry.weight;
        }
      }

      if (weightToUse !== undefined) {
        weightHistory.push({
          date,
          weight: weightToUse,
        });
      }
    }
  });
  return { last4Weeks: last4Weeks, weightHistory: weightHistory };
};

export function WeightChart() {
  const font = useFont(require('assets/roboto.ttf'), 12);
  const [weightChartData, setWeightChartData] = useState<{ date: string; weight: number }[]>();
  const [last4Weeks, setLast4Weeks] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      const fetchWeight = await fetchUserWeightHistory(user?.id);
      if (!fetchWeight || Object.keys(fetchWeight).length == 0) {
        setWeightChartData(fetchWeight);
        return;
      }

      const weightArray = Object.entries(fetchWeight).map(([date, weight]) => ({
        date,
        weight: Number(weight),
      }));

      const dataToUse = getLast4Weeks(weightArray);
      setLast4Weeks(dataToUse.last4Weeks);
      const convertedData = dataToUse.weightHistory.slice(-20).map(({ date, weight }) => ({
        date: date,
        weight,
      }));

      setWeightChartData(convertedData);
    };
    fetch();
  }, [user?.id]);

  if (weightChartData && last4Weeks.length > 0) {
    const weights = weightChartData.map((d) => d.weight);
    const minY = Math.floor(Math.min(...weights) - 4);
    const maxY = Math.ceil(Math.max(...weights) + 4);
    return (
      <View className="h-[300px] rounded-md bg-white p-5">
        <Text className="mb-4 text-xl font-bold text-gray-900">Weight Progress</Text>
        <CartesianChart
          data={weightChartData}
          xKey="date"
          yKeys={['weight']}
          domain={{ y: [minY, maxY] }}
          xAxis={{
            font,
            formatXLabel(label) {
              return label.toString().substring(5);
            },
            tickValues: [
              0,
              Math.floor((weightChartData.length * 1) / 3),
              Math.floor((weightChartData.length * 2) / 3),
              Math.floor(weightChartData.length - 1),
            ],
          }}
          axisOptions={{
            font,
            formatXLabel(label) {
              return label.toString().substring(5);
            },
          }}>
          {({ points }) => <Line points={points.weight} color="#1F2937" strokeWidth={3} />}
        </CartesianChart>
      </View>
    );
  }
  return (
    <View className="rounded-md bg-white p-5">
      <Text className="mb-4 text-xl font-bold text-gray-900">Weight Progress</Text>
      <View className="items-center justify-center gap-4 py-10">
        <Text className="text-center text-xl text-gray-400">There are no weights to show.</Text>
        <Pressable
          className="rounded-md bg-gray-800 px-4 py-2"
          onPress={() => {
            router.push('/weight');
          }}>
          <Text className="text-lg text-white">Add Weight</Text>
        </Pressable>
      </View>
    </View>
  );
}

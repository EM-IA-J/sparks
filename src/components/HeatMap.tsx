import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface HeatMapProps {
  data: { date: string; count: number }[];
}

export const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  // Get last 6 months (approximately 26 weeks = 182 days)
  const today = new Date();
  const days: { date: Date; count: number; month: number }[] = [];

  // Start from 181 days ago to get 6 months
  for (let i = 181; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = data.find(d => d.date === dateStr);
    const month = date.getMonth();
    days.push({ date, count: dayData?.count || 0, month });
  }

  // Organize into weeks (columns)
  const weeks: { date: Date; count: number; month: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Get month labels - show every other month to avoid crowding
  const monthLabels: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  let monthCount = 0;
  weeks.forEach((week, weekIdx) => {
    const firstDay = week[0];
    if (firstDay && firstDay.month !== lastMonth) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      // Only show every other month
      if (monthCount % 2 === 0) {
        monthLabels.push({
          month: monthNames[firstDay.month],
          weekIndex: weekIdx
        });
      }
      lastMonth = firstDay.month;
      monthCount++;
    }
  });

  const getColor = (count: number) => {
    if (count === 0) return theme.colors.borderLight;
    if (count === 1) return theme.colors.primary + '40'; // 25% opacity
    if (count === 2) return theme.colors.primary + '80'; // 50% opacity
    return theme.colors.primary; // 100% opacity
  };

  const dayLabels = ['', 'M', '', 'W', '', 'F', '']; // Only show M, W, F like GitHub

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Heatmap</Text>
      <View style={styles.contentWrapper}>
        {/* Month labels */}
        <View style={styles.monthLabels}>
          {monthLabels.map((label, i) => (
            <Text
              key={i}
              style={[styles.monthLabel, { left: label.weekIndex * 14 }]}
            >
              {label.month}
            </Text>
          ))}
        </View>

        {/* Heatmap grid */}
        <View style={styles.heatmap}>
          <View style={styles.dayLabels}>
            {dayLabels.map((label, i) => (
              <Text key={i} style={styles.dayLabel}>{label}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {weeks.map((week, weekIdx) => (
              <View key={weekIdx} style={styles.week}>
                {week.map((day, dayIdx) => (
                  <View
                    key={dayIdx}
                    style={[
                      styles.day,
                      { backgroundColor: getColor(day.count) }
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        {[0, 1, 2, 3].map((level) => (
          <View
            key={level}
            style={[styles.legendBox, { backgroundColor: getColor(level) }]}
          />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  contentWrapper: {
    paddingHorizontal: theme.spacing.lg,
  },
  monthLabels: {
    flexDirection: 'row',
    height: 20,
    marginBottom: theme.spacing.xs,
    marginLeft: 24, // Offset for day labels
    position: 'relative',
  },
  monthLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    position: 'absolute',
  },
  heatmap: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: 5,
    justifyContent: 'space-around',
    paddingTop: 2,
  },
  dayLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    height: 11,
    lineHeight: 11,
    textAlign: 'right',
    width: 11,
  },
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  week: {
    gap: 3,
  },
  day: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: 4,
  },
  legendText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});

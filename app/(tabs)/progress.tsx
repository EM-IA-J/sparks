import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../src/store/useUserStore';
import { useAssignmentStore } from '../../src/store/useAssignmentStore';
import { Card, StatCard, HeatMap } from '../../src/components';
import { theme } from '../../src/theme';
import { COPY } from '../../src/copy';
import { Area } from '../../src/types';
import { CHALLENGE_SEEDS } from '../../src/data/challenges.seed';

export default function ProgressScreen() {
  const user = useUserStore((state) => state.user);
  const history = useAssignmentStore((state) => state.history);

  const completedChallenges = history.filter((a) => a.status === 'completed');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCompleted = completedChallenges.length;
    const fireCount = completedChallenges.filter(a => a.feedback === 'fire').length;
    const goodCount = completedChallenges.filter(a => a.feedback === 'good').length;
    const successRate = totalCompleted > 0
      ? Math.round(((fireCount + goodCount) / totalCompleted) * 100)
      : 0;

    // Calculate total time (assume average 20 min per challenge)
    const totalMinutes = totalCompleted * 20;
    const totalHours = Math.floor(totalMinutes / 60);

    // Best day of week
    const dayCount: Record<number, number> = {};
    completedChallenges.forEach(a => {
      if (a.completedAt) {
        const day = new Date(a.completedAt).getDay();
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    });
    const bestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const bestDayName = bestDay ? dayNames[parseInt(bestDay[0])] : 'N/A';

    // Prepare heatmap data
    const heatmapData = completedChallenges.map(a => ({
      date: a.completedAt ? new Date(a.completedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      count: 1,
    }));

    // Aggregate by date
    const dateMap: Record<string, number> = {};
    heatmapData.forEach(d => {
      dateMap[d.date] = (dateMap[d.date] || 0) + d.count;
    });
    const aggregatedHeatmap = Object.entries(dateMap).map(([date, count]) => ({ date, count }));

    return {
      totalCompleted,
      fireCount,
      successRate,
      totalHours,
      bestDayName,
      heatmapData: aggregatedHeatmap,
    };
  }, [completedChallenges]);

  // Count by area (based on challenge template areaTags)
  const byArea: Partial<Record<Area, number>> = {};
  completedChallenges.forEach((assignment) => {
    const template = CHALLENGE_SEEDS.find(t => t.id === assignment.templateId);
    if (template) {
      template.areaTags.forEach((area) => {
        byArea[area] = (byArea[area] || 0) + 1;
      });
    }
  });

  // Top moments (fire feedback)
  const topMoments = completedChallenges
    .filter((a) => a.feedback === 'fire')
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>{COPY.progress.title}</Text>

        <Card style={styles.streakCard}>
          <Text style={styles.streakNumber}>{user?.streak || 0}</Text>
          <Text style={styles.streakLabel}>{COPY.progress.streak}</Text>
        </Card>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Completed"
          value={stats.totalCompleted}
          icon="✅"
          color={theme.colors.primary}
        />
        <StatCard
          label="Fire Moments"
          value={stats.fireCount}
          icon="🔥"
          color={theme.colors.secondary}
        />
        <StatCard
          label="Success Rate"
          value={`${stats.successRate}%`}
          icon="📈"
          color={theme.colors.areas.mindfulness}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          label="Total Hours"
          value={stats.totalHours}
          icon="⏱️"
          color={theme.colors.areas.health}
        />
        <StatCard
          label="Best Day"
          value={stats.bestDayName}
          icon="📅"
          color={theme.colors.areas.creativity}
        />
        <StatCard
          label="Streak"
          value={user?.streak || 0}
          icon="🔥"
          color={theme.colors.error}
        />
      </View>
      </View>

      {/* Heatmap - Full Width */}
      {stats.heatmapData.length > 0 && (
        <View style={styles.heatmapContainer}>
          <HeatMap data={stats.heatmapData} />
        </View>
      )}

      <View style={styles.content}>
      {Object.keys(byArea).length > 0 && (
        <Card style={styles.areasCard}>
          <Text style={styles.sectionTitle}>{COPY.progress.byArea}</Text>
          {Object.entries(byArea)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .map(([area, count]) => (
              <View key={area} style={styles.areaRow}>
                <View
                  style={[
                    styles.areaDot,
                    { backgroundColor: theme.colors.areas[area as Area] },
                  ]}
                />
                <Text style={styles.areaLabel}>{area}</Text>
                <Text style={styles.areaCount}>{count}</Text>
              </View>
            ))}
        </Card>
      )}

      {topMoments.length > 0 && (
        <Card style={styles.momentsCard}>
          <Text style={styles.sectionTitle}>{COPY.progress.topMoments}</Text>
          {topMoments.map((moment) => {
            const template = CHALLENGE_SEEDS.find(t => t.id === moment.templateId);
            return (
              <View key={moment.id} style={styles.momentRow}>
                <Text style={styles.momentEmoji}>🔥</Text>
                <Text style={styles.momentText}>
                  {template?.title || 'Unknown Challenge'}
                </Text>
              </View>
            );
          })}
        </Card>
      )}

      {completedChallenges.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>{COPY.progress.noMomentsYet}</Text>
        </Card>
      )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  streakCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  heatmapContainer: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: theme.fontWeight.bold,
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: theme.fontSize.lg,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statNumber: {
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  areasCard: {
    marginBottom: theme.spacing.md,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  areaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  areaLabel: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  areaCount: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  momentsCard: {
    marginBottom: theme.spacing.md,
  },
  momentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  momentEmoji: {
    fontSize: theme.fontSize.xl,
    marginRight: theme.spacing.sm,
  },
  momentText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

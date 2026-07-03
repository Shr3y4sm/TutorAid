import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import {
  StudentProfile,
  getStudentProfile,
} from "@/api/profile";
import ProfileActionButton from "@/features/student/components/profile/ProfileActionButton";
import ProfileHeaderCard from "@/features/student/components/profile/ProfileHeaderCard";
import ProfileInfoRow from "@/features/student/components/profile/ProfileInfoRow";
import ProfileSectionCard from "@/features/student/components/profile/ProfileSectionCard";
import ProfileStatCard from "@/features/student/components/profile/ProfileStatCard";

export default function ProfileScreen() {
  const [profile, setProfile] =
    useState<StudentProfile | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setError(null);

      const data = await getStudentProfile();

      setProfile(data);
    } catch (loadError) {
      console.log(loadError);

      setError(
        "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshProfile() {
    setRefreshing(true);

    try {
      await loadProfile();
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>
          Profile
        </Text>

        <Text style={styles.message}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProfile}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>
          Profile
        </Text>

        <Text style={styles.message}>
          No profile details available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshProfile}
        />
      }
    >
      <ProfileHeaderCard
        profile={profile}
      />

      <ProfileSectionCard title="Academic Information">
        <ProfileInfoRow
          label="CGPA"
          value={profile.academic.cgpa}
        />

        <ProfileInfoRow
          label="Attendance"
          value={`${profile.academic.attendancePercentage}%`}
        />

        <ProfileInfoRow
          label="Credits Completed"
          value={profile.academic.creditsCompleted}
        />

        <ProfileInfoRow
          label="Current Semester"
          value={profile.academic.currentSemester}
        />
      </ProfileSectionCard>

      <ProfileSectionCard title="Contact Information">
        <ProfileInfoRow
          label="Email"
          value={profile.contact.email}
        />

        <ProfileInfoRow
          label="Phone"
          value={profile.contact.phone}
        />
      </ProfileSectionCard>

      <ProfileSectionCard title="Parent / Guardian">
        <ProfileInfoRow
          label="Name"
          value={profile.guardian.name}
        />

        <ProfileInfoRow
          label="Phone"
          value={profile.guardian.phone}
        />
      </ProfileSectionCard>

      <Text style={styles.sectionTitle}>
        Quick Statistics
      </Text>

      <View style={styles.statsGrid}>
        <ProfileStatCard
          label="Assignments Submitted"
          value={profile.statistics.assignmentsSubmitted}
        />

        <ProfileStatCard
          label="Pending Assignments"
          value={profile.statistics.pendingAssignments}
        />

        <ProfileStatCard
          label="Courses Enrolled"
          value={profile.statistics.coursesEnrolled}
        />

        <ProfileStatCard
          label="Certificates"
          value={profile.statistics.certificates}
        />
      </View>

      <ProfileSectionCard title="Actions">
        <ProfileActionButton
          title="Edit Profile"
          icon="create-outline"
        />

        <ProfileActionButton
          title="Change Password"
          icon="lock-closed-outline"
        />

        <ProfileActionButton
          title="Settings"
          icon="settings-outline"
        />

        <ProfileActionButton
          title="Logout"
          icon="log-out-outline"
          color="#DC2626"
        />
      </ProfileSectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  center: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  message: {
    color: "#64748B",
    fontSize: 16,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 4,
  },
});

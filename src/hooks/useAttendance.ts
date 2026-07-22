import { useEffect, useState } from "react";

import * as AttendanceApi from "@/api/attendance";

import {
  Attendance,
  AttendanceSummary,
} from "@/types/attendance";

export function useAttendance(date: string) {

  const [attendance, setAttendance] =
    useState<Attendance[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function refresh() {

    setLoading(true);

    try {

      const data =
        await AttendanceApi.getAttendance(date);

      setAttendance(data);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    refresh();

  }, [date]);

  return {

    attendance,

    loading,

    refresh,

    setAttendance,

  };

}

export function useAttendanceSummary(
  studentId: string
) {

  const [summary, setSummary] =
    useState<AttendanceSummary>();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const data =
          await AttendanceApi.getAttendanceSummary(
            studentId
          );

        setSummary(data);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, [studentId]);

  return {

    summary,

    loading,

  };

}
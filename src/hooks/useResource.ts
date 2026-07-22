import { useCallback, useEffect, useState } from "react";
import * as ResourceApi from "@/api/resource";
import { Resource } from "@/types/resource";

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const response =
    await ResourceApi.getResources();

setResources(response.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load();
  }

  return {
    resources,
    loading,
    refreshing,
    refresh,
    setResources,
  };
}
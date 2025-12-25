import { useQuery } from "@tanstack/react-query";
import axios from 'axios'
const useFetch = () => {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const [services, accounts, subs, clients] = await Promise.all([
        axios("/api/services"),
        axios("/api/accounts"),
        axios("/api/subscriptions"),
        axios("/api/clients"),
      ]);
      return {
        services: services.data,
        accounts: accounts.data,
        subscriptions: subs.data,
        clients: clients.data,
      };
    },
  });
}

export default useFetch 
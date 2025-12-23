import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import axios from "axios";
import { format, diffDays, date } from "@formkit/tempo";
import { Trash2, Eye, SquarePen } from "lucide-react";

type Service = {
  name: string;
  price: number;
  serviceId: number;
};

type Client = {
  clientId: number;
  name: string;
  lastName: string;
  phone: string;
};

type Account = {
  accountId: number;
  serviceId: number;
  email: string;
  password: string;
  subscriptions: Subscription[];
  screens: Screen[];
};

type Subscription = {
  accountId: number;
  client: Client;
  clientId: number;
  endDate: string
  startDate: string;
  subscriptionId: number;
};

type Screen = {
  accountId: number;
  screenId: number;
  name: string;
  pin: string;
};

const formatDate = (startDate: string, endDate?: string) => {
  const dateFormat = format(startDate, "short");
  const dateDiff = endDate ? diffDays(endDate, startDate) : null;
  return { dateFormat, dateDiff };
};

const App = () => {
  const { data } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const [services, accounts] = await Promise.all([
        axios("/api/services"),
        axios("/api/accounts"),
      ]);
      return {
        services: services.data,
        accounts: accounts.data,
      };
    },
  });

  const services = data?.services;
  const accounts = data?.accounts;
  console.log(accounts);

  const actions = [
    "Agregar Cuenta",
    "Cuentas Disponibles",
    "Usuarios",
    "Agregar Usuario",
    "Agregar Servicio",
  ];

  return (
    <div className="h-screen w-screen">
      <section className="w-full h-full grid grid-cols-6 gap-4">
        <div className="p-2">
          <h2 className="text-lg mb-4 text-center font-semibold">Cobrar</h2>
          <article className=" text-sm rounded-sm border border-solid p-2 flex items-center justify-between">
            Martin <span className="text-xs">Ver Detalles</span>
          </article>
        </div>
        <div className="w-full h-full col-span-4 flex flex-col justify-between">
          <h2 className="text-lg mb-4 text-center font-semibold self-start">
            Información
          </h2>
          <div className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Correo</TableHead>
                  <TableHead>Contraseña</TableHead>
                  <TableHead>Pantalla</TableHead>
                  <TableHead>PIN</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contratado</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts?.map((account: Account) => (
                  <TableRow>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.password}</TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.screens.map((screen) => (
                          <span>{screen.name}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.screens.map((screen) => (
                          <span>{screen.pin}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map((sub) => (
                          <span>{sub.client.name}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map((sub) => (
                          <span>{formatDate(sub.startDate).dateFormat}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map((sub) => (
                          <span>{formatDate(sub.endDate).dateFormat}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map((sub) => {
                          const { dateDiff } = formatDate(
                            sub.startDate,
                            sub.endDate
                          );
                          return dateDiff && dateDiff > 0
                            ? <span>{
                              dateDiff > 1
                              ? dateDiff + " días"
                              : dateDiff + " día"
                            }
                            </span>
                            : <span>"Vencido"</span>;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map(
                          (sub) =>
                            sub && (
                              <div className="flex gap-1">
                                <Trash2 className="w-5 h-5" />
                                <Eye className="w-5 h-5" />
                                <SquarePen className="w-5 h-5" />
                              </div>
                            )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="justifyselfend">
            <ul
              className={`grid gap-2 place-items-center`}
              style={{
                gridTemplateColumns: `repeat(${services?.length}, minmax(0, 1fr))`,
              }}
            >
              {services?.map((service: Service) => (
                <li
                  className="p-2 text-sm text-center border border-solid rounded-t-sm w-full"
                  key={service.serviceId}
                >
                  {service.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-2">
          <h2 className="text-lg mb-2 text-center font-semibold">Acciones</h2>

          {actions.map((action) => (
            <article
              key={action}
              className=" text-sm rounded-sm border border-solid p-2 flex items-center justify-between"
            >
              {action}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;

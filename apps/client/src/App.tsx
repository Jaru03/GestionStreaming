import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { format, diffDays } from "@formkit/tempo";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import DinamicTable from "./components/DinamicTable";
import { useState } from "react";
import useFetch from "./hooks/useFetch";

export type Service = {
  name: string;
  price: number;
  serviceId: number;
};

export type Client = {
  clientId: number;
  name: string;
  lastName: string;
  phone: string;
  subscriptions: Subscription[];
};

export type Account = {
  accountId: number;
  email: string;
  password: string;
  service: Service;
  serviceId: number;
  subscriptions: Subscription[];
};

export type Subscription = {
  accountId: number;
  client: Client;
  clientId: number;
  endDate: string;
  startDate: string;
  subscriptionId: number;
  screenName: string;
  screenPin: string;
  account: Account;
};

const App = () => {
  const { data } = useFetch();
  const services = data?.services;
  const accounts = data?.accounts;
  const subscriptions = data?.subscriptions;
  const clients = data?.clients;

  const [serviceSelected, setServiceSelected] = useState(0);
  const [clientSelected, setClientSelected] = useState<Client | null>(null);

  console.log(clientSelected);

  const handleServiceSelect = (id: number) => {
    setServiceSelected(id);
  };

  const handleClient = (id: number) => {
    const client = clients?.filter((client: Client) => client.clientId === id);
    setClientSelected(client[0]);
  };

  console.log(clientSelected);

  const filteredAccounts =
    data?.accounts?.filter(
      (account: Account) =>
        serviceSelected === 0 || account.serviceId === serviceSelected
    ) ?? [];

  const actions = [
    {
      label: "Cuentas",
      action: "accounts",
    },
    {
      label: "Suscripciones",
      action: "subscriptions",
    },
    {
      label: "Usuarios",
      action: "clients",
    },
    {
      label: "Servicios",
      action: "services",
    },
  ];

  const totalAmount = clientSelected?.subscriptions.reduce(
    (anterior, actual) => actual.account.service.price + anterior,
    0
  );
  return (
    <div className="h-screen w-screen">
      <section className="w-full h-full grid grid-cols-6 gap-4">
        <div className="grid grid-rows-3 gap-4 p-2">
          <div>
            <h2 className="text-lg mb-4 text-center font-semibold">Cobrar</h2>
            <article className=" text-sm rounded-sm border border-solid p-2 flex items-center justify-between">
              Martin <span className="text-xs">Ver Detalles</span>
            </article>
          </div>
          <div>
            <h2 className="text-lg mb-4 text-center font-semibold">Avisar</h2>
            <article className=" text-sm rounded-sm border border-solid p-2 flex items-center justify-between">
              Martin <span className="text-xs">Ver Detalles</span>
            </article>
          </div>
          <div>
            <h2 className="text-lg mb-4 text-center font-semibold">Cortar</h2>
            <article className=" text-sm rounded-sm border border-solid p-2 flex items-center justify-between">
              Martin <span className="text-xs">Ver Detalles</span>
            </article>
          </div>
        </div>
        <div className="w-full h-full col-span-4 flex flex-col justify-between pt-2">
          <h2 className="text-lg  mb-4 text-center font-semibold">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts?.map((account: Account) => (
                  <TableRow>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger
                          asChild
                          className="cursor-pointer hover:underline"
                        >
                          <span>{account.email}</span>
                        </DialogTrigger>
                        <DialogContent className="space-y-4">
                          <DialogTitle className="text-lg font-semibold">
                            Información de la Cuenta
                          </DialogTitle>

                          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                            {account.subscriptions.map((sub: Subscription) => (
                              <article
                                key={sub.subscriptionId}
                                className="p-2 border rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                              >
                                <p className="font-medium">
                                  {sub.client.name} {sub.client.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {sub.screenName} - PIN: {sub.screenPin}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Inicio: {formatDate(sub.startDate).dateFormat}{" "}
                                  | Vencimiento:{" "}
                                  {formatDate(sub.endDate).dateFormat}
                                </p>
                              </article>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>{account.password}</TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map((sub) => (
                          <span>{sub.screenName}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map((sub) => (
                          <span>{sub.screenPin}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-rows-4 gap-1">
                        {account.subscriptions.map((sub) => (
                          <Dialog>
                            <DialogTrigger
                              onClick={() => {
                                handleClient(sub.client.clientId);
                              }}
                              asChild
                              className="cursor-pointer hover:underline"
                            >
                              <span>{sub.client.name}</span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">
                                  Información del Cliente
                                </DialogTitle>
                              </DialogHeader>

                              {/* Información general del cliente */}
                              <div className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
                                <ul className="space-y-2 text-sm text-gray-700">
                                  <li className="flex gap-1">
                                    <span className="font-medium">
                                      Total de suscripciones:
                                    </span>
                                    <span>
                                      {clientSelected?.subscriptions?.length ??
                                        0}
                                    </span>
                                  </li>
                                  <li className="flex gap-1">
                                    <span className="font-medium">
                                      Precio total de servicios:
                                    </span>
                                    <span>${totalAmount ?? 0}</span>
                                  </li>
                                </ul>
                              </div>

                              {/* Lista de suscripciones */}
                              <div className="space-y-3 max-h-64 overflow-y-auto">
                                {clientSelected?.subscriptions.map(
                                  (sub: Subscription, index: number) => (
                                    <div
                                      key={index}
                                      className="p-3 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition"
                                    >
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex gap-1">
                                          <span className="font-medium">
                                            Correo:
                                          </span>
                                          {sub.account.email}
                                        </div>
                                        <div className="flex gap-1">
                                          <span className="font-medium">
                                            Contraseña:
                                          </span>
                                          {sub.account.password}
                                        </div>
                                        <div className="flex gap-1">
                                          <span className="font-medium">
                                            Pantalla:
                                          </span>
                                          {sub.screenName}
                                        </div>
                                        <div className="flex gap-1">
                                          <span className="font-medium">
                                            PIN:
                                          </span>
                                          {sub.screenPin}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
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
                          return dateDiff && dateDiff > 0 ? (
                            <span>
                              {dateDiff > 1
                                ? dateDiff + " días"
                                : dateDiff + " día"}
                            </span>
                          ) : (
                            <span>"Vencido"</span>
                          );
                        })}
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
                gridTemplateColumns: `repeat(${
                  services?.length + 1
                }, minmax(0, 1fr))`,
              }}
            >
              <li
                className={`p-2 text-sm text-center border border-solid rounded-t-sm ${
                  serviceSelected === 0 && "bg-gray-200"
                } w-full`}
                onClick={() => handleServiceSelect(0)}
              >
                Todo
              </li>
              {services?.map((service: Service) => (
                <li
                  className={`p-2 text-sm text-center border border-solid rounded-t-sm w-full ${
                    serviceSelected === service.serviceId && "bg-gray-200"
                  }`}
                  onClick={() => handleServiceSelect(service.serviceId)}
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
            <Dialog>
              <DialogTrigger className="text-white text-xs">
                {action.label}
              </DialogTrigger>

              <DialogContent className="w-5xl flex flex-col h-4/5 sm:max-w-none">
                <DialogHeader>
                  <DialogTitle>{action.label}</DialogTitle>
                  <DialogDescription>
                    Qué quieres hacer con los {action.label.toLowerCase()}?
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      className="pl-9"
                    />
                  </div>

                  <div>
                    <DinamicTable
                      action={action}
                      accounts={accounts}
                      clients={clients}
                      services={services}
                      subscriptions={subscriptions}
                    ></DinamicTable>
                  </div>

                  <CreateDialog label={action.label} />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>
    </div>
  );
};

export const formatDate = (startDate: string, endDate?: string) => {
  const dateFormat = format(startDate, "short");
  const dateDiff = endDate ? diffDays(endDate, startDate) : null;
  return { dateFormat, dateDiff };
};

function CreateDialog({ label }: { label: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {renderCreateContent(label)}
      </DialogContent>
    </Dialog>
  );
}

function renderCreateContent(label: string) {
  switch (label) {
    case "Cuentas":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Crear Cuenta</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input placeholder="Correo" />
            <Input placeholder="Contraseña" />
            <Input placeholder="Servicio ID" />
            <Button className="w-full">Crear</Button>
          </form>
        </>
      );

    case "Servicios":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Crear Servicio</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input placeholder="Nombre del servicio" />
            <Input type="number" placeholder="Precio" />
            <Button className="w-full">Crear</Button>
          </form>
        </>
      );

    case "Usuarios":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Crear Usuario</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input placeholder="Nombre" />
            <Input placeholder="Apellido" />
            <Input placeholder="Teléfono" />
            <Button className="w-full">Crear</Button>
          </form>
        </>
      );

    case "Suscripciones":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Crear Suscripción</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input placeholder="Cuenta ID" />
            <Input placeholder="Cliente ID" />
            <Input placeholder="Pantalla" />
            <Input placeholder="PIN" />
            <Button className="w-full">Crear</Button>
          </form>
        </>
      );

    default:
      return (
        <DialogHeader>
          <DialogTitle>No disponible</DialogTitle>
        </DialogHeader>
      );
  }
}

export default App;

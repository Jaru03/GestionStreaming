import React from "react";
import { SquarePen, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Account, Client, Service, Subscription } from "@/App";

import { formatDate } from "@/App";
import { DialogHeader, Dialog, DialogContent, DialogTrigger} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

/* -------------------------------- TYPES -------------------------------- */

type DinamicTableProps = {
  action: { label: string; action: string };
  accounts?: Account[];
  services?: Service[];
  clients?: Client[];
  subscriptions?: Subscription[];
};

/* ----------------------------- ROW ACTIONS ------------------------------ */

function renderDialogContent(label: string, info: any) {
  switch (label) {
    case "Cuentas":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Editar Cuenta</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input defaultValue={info.email} placeholder="Correo" />
            <Input defaultValue={info.password} placeholder="Contraseña" />
            <Button className="w-full">Actualizar</Button>
          </form>
        </>
      );

    case "Servicios":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input defaultValue={info.name} placeholder="Nombre del servicio" />
            <Input defaultValue={info.price} placeholder="Precio" type="number" />
            <Button className="w-full">Actualizar</Button>
          </form>
        </>
      );

    case "Usuarios":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input defaultValue={info.name} placeholder="Nombre" />
            <Input defaultValue={info.lastName} placeholder="Apellido" />
            <Input defaultValue={info.phone} placeholder="Teléfono" />
            <Button className="w-full">Actualizar</Button>
          </form>
        </>
      );

    case "Suscripciones":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Editar Suscripción</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input defaultValue={info.screenName} placeholder="Pantalla" />
            <Input defaultValue={info.screenPin} placeholder="PIN" />
            <Input defaultValue={info.startDate} type="date" />
            <Button className="w-full">Actualizar</Button>
          </form>
        </>
      );

    default:
      return (
        <DialogHeader>
          <DialogTitle>Acción no disponible</DialogTitle>
        </DialogHeader>
      );
  }
}


function RowActions({ id, action, label, info}: { id: number; action: string, label: string, info:any }) {
  return (
    <div className="flex gap-2">
      <Trash2
        onClick={() => {
          console.log(`api/${action}/${id}`);
        }}
        className="w-4 h-4 cursor-pointer text-destructive"
      />
      <Dialog>
        <DialogTrigger asChild>
          <SquarePen className="w-4 h-4 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          {renderDialogContent(label, info)}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------------------- MAIN COMPONENT ----------------------------- */

const DinamicTable = ({
  action,
  accounts,
  services,
  clients,
  subscriptions,
}: DinamicTableProps) => {
  type TableConfig<T> = {
    headers: string[];
    renderRow: (row: T) => React.ReactNode;
  };

  const tableConfig: Record<string, TableConfig<any>> = {
    Cuentas: {
      headers: ["Correo", "Contraseña", "Servicio", "Acciones"],
      renderRow: (account: Account) => (
        <>
          <TableCell>{account.email}</TableCell>
          <TableCell>{account.password}</TableCell>
          <TableCell>{account.service.name}</TableCell>
          <TableCell>
            <RowActions info={account} id={account.accountId} action={action.action} label={action.label} />
          </TableCell>
        </>
      ),
    },

    Servicios: {
      headers: ["Nombre", "Precio", "Acciones"],
      renderRow: (service: Service) => (
        <>
          <TableCell>{service.name}</TableCell>
          <TableCell>${service.price}</TableCell>
          <TableCell>
            <RowActions info={service} id={service.serviceId} action={action.action} label={action.label} />
          </TableCell>
        </>
      ),
    },

    Usuarios: {
      headers: ["Nombre", "Apellido", "Teléfono", "Acciones"],
      renderRow: (client: Client) => (
        <>
          <TableCell>{client.name}</TableCell>
          <TableCell>{client.lastName}</TableCell>
          <TableCell>{client.phone}</TableCell>
          <TableCell>
            <RowActions info={client} id={client.clientId} action={action.action} label={action.label} />
          </TableCell>
        </>
      ),
    },

    Suscripciones: {
      headers: [
        "Correo",
        "Pantalla",
        "PIN",
        "Cliente",
        "Inicio",
        "Vencimiento",
        "Acciones",
      ],
      renderRow: (sub: Subscription) => (
        <>
          <TableCell>{sub.account.email}</TableCell>
          <TableCell>{sub.screenName}</TableCell>
          <TableCell>{sub.screenPin}</TableCell>
          <TableCell>
            {sub.client.name} {sub.client.lastName}
          </TableCell>
          <TableCell>{formatDate(sub.startDate).dateFormat}</TableCell>
          <TableCell>{formatDate(sub.endDate).dateFormat}</TableCell>
          <TableCell>
            <RowActions info={sub} id={sub.subscriptionId} action={action.action} label={action.label} />
          </TableCell>
        </>
      ),
    },
  };

  const dataMap: Record<string, any[]> = {
    Cuentas: accounts ?? [],
    Servicios: services ?? [],
    Usuarios: clients ?? [],
    Suscripciones: subscriptions ?? [],
  };

  const config = tableConfig[action.label];
  const rows = dataMap[action.label];

  if (!config) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {config.headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>{config.renderRow(row)}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DinamicTable;
